// components/ManikayuCertificateOCR.jsx

import React, { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from "@components/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@components/components/ui/dialog";
import { Input } from "@components/components/ui/input";
import { Label } from "@components/components/ui/label";
import { toast } from "sonner";
import { RootState } from '@components/lib/store';
import { insertManikayuRecord } from '../data-table/maklumatPeribadi-DT/pengakap-manikayu-DT/DataFetching';


// --- Reusable Form Input Components ---
const TextInputField = ({ id, label, value, onChange, required, disabled, placeholder, className }) => (
    <div className={`grid flex-1 gap-1.5 ${className}`}>
        <Label htmlFor={id}>{label}{required && <span className="text-red-500">*</span>}</Label>
        <Input id={id} value={value} onChange={onChange} required={required} disabled={disabled} placeholder={placeholder} />
    </div>
);

// DateInputField to handle full DD.MM.YYYY date string
const DateInputField = ({ id, label, value, onChange, required, disabled, placeholder, className }) => (
    <div className={`grid flex-1 gap-1.5 ${className}`}>
        <Label htmlFor={id}>{label}{required && <span className="text-red-500">*</span>}</Label>
        <Input
            id={id}
            type="text" // Keep as text to easily accept DD.MM.YYYY
            placeholder={placeholder || "DD.MM.YYYY"} // Updated placeholder
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            // Removed maxLength as it now accepts full date
        />
    </div>
);

// --- Main Component: ManikayuCertificateOCR ---
const ManikayuCertificateOCR = () => {
    // --- Redux State Access ---
    const dispatch = useDispatch();
    const userNoIC = useSelector((state: RootState) => state.pengakap.noIC);
    console.log("User's Redux noIC:", userNoIC);

    // --- Form State ---
    const [isLoading, setIsLoading] = useState(false);
    const [unit, setUnit] = useState("");
    const [noSijil, setNoSijil] = useState("");
    const [tahunLulus, setTahunLulus] = useState(""); // This stores DD.MM.YYYY
    const [salinanSijil, setSalinanSijil] = useState("");

    // --- OCR State ---
    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [extractedOcrData, setExtractedOcrData] = useState(null);
    const [isOcrProcessing, setIsOcrProcessing] = useState(false);
    const [ocrError, setOcrError] = useState(null);

    const fileInputRef = useRef(null);

    // --- Handlers ---
    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setImageFile(file);
            setImagePreviewUrl(URL.createObjectURL(file));
            setOcrError(null);
            setExtractedOcrData(null);
            setUnit("");
            setNoSijil("");
            setTahunLulus("");
            setSalinanSijil("");
        }
    };

    const performOcr = async () => {
        if (!imageFile) {
            toast.warning("Tiada Imej", {
                description: "Sila muat naik imej sijil terlebih dahulu.",
            });
            return;
        }

        setIsOcrProcessing(true);
        setOcrError(null);
        setExtractedOcrData(null); // Clear previous data

        const worker = await createWorker('eng');

        try {
            const { data: { text } } = await worker.recognize(imageFile);
            console.log("Raw OCR Text:", text);

            const extracted = extractDataFromOcrText(text);

            // --- IC Validation Logic ---
            if (!extracted.icNo) {
                setOcrError("Nombor KP tidak dapat dikesan dari sijil. Sila masukkan secara manual atau cuba imej yang lebih jelas.");
                toast.error("Ralat Pengesahan KP", {
                    description: "Nombor KP gagal diekstrak.",
                });
                setUnit(""); setNoSijil(""); setTahunLulus(""); setSalinanSijil(""); setExtractedOcrData(null);
                return;
            }

            const normalizedExtractedIc = extracted.icNo.replace(/[-\s]/g, '');
            const normalizedUserIc = userNoIC.replace(/[-\s]/g, '');

            if (normalizedExtractedIc !== normalizedUserIc) {
                setOcrError(`Nombor KP yang diekstrak (${extracted.icNo}) tidak sepadan dengan Nombor KP anda yang berdaftar. Sila pastikan ini sijil anda.`);
                toast.error("Ralat Pengesahan KP", {
                    description: "Nombor KP yang diekstrak bukan milik anda.",
                });
                setUnit(""); setNoSijil(""); setTahunLulus(""); setSalinanSijil(""); setExtractedOcrData(null);
                return;
            }
            // --- End IC Validation Logic ---

            // If IC matches, proceed to set all extracted data and auto-fill
            setExtractedOcrData(extracted); // Set for preview on the right side

            setUnit(extracted.unit || "");
            setNoSijil(extracted.noSijil || "");
            // Set tahunLulus to the full extracted date string (DD.MM.YYYY)
            setTahunLulus(extracted.date || "");
            setSalinanSijil(imagePreviewUrl);

            toast.success("OCR Berjaya", {
                description: "Maklumat sijil berjaya diekstrak dan Nombor KP disahkan. Medan borang telah dipenuhi.",
            });

        } catch (error) {
            console.error("OCR Error:", error);
            setOcrError("Ralat semasa melakukan OCR. Sila pastikan imej jelas dan cuba lagi.");
            toast.error("OCR Ralat", {
                description: "Gagal mengekstrak maklumat. Sila pastikan imej jelas.",
            });
        } finally {
            await worker.terminate();
            setIsOcrProcessing(false);
        }
    };

    // Helper function to extract specific data using regex from OCR text
    const extractDataFromOcrText = (ocrText) => {
        const data = {};

        const icNoMatch = ocrText.match(/(\d{6}-\d{2}-\d{4}|\d{12})/);
        if (icNoMatch) {
            data.icNo = icNoMatch[0];
        }

        const unitMatch = ocrText.match(
            /(PEMIMPIN|PENOLONG PEMIMPIN)\s+PENGAKAP\s+(KANAK-KANAK|MUDA)[\s\S]*?(DAERAH[\s\S]*?(JOHOR|MELAKA|SABAH|SARAWAK|PERAK|KEDAH|PULAU PINANG|SELANGOR|NEGERI SEMBILAN|PAHANG|TERENGGANU|KELANTAN|PERLIS|WP KUALA LUMPUR|WP LABUAN|WP PUTRAJAYA)\s*[\s\S]*?)(?=NO\.|No\. Pendaftaran|TARIKH|Tarikh|DI\s*BERI|DIBERI|Maj\.|Dr\.|Haji\.|Dato\.|HAJI\.)/i
        );
        if (unitMatch) {
            let fullUnit = unitMatch[0].replace(/\s+/g, ' ').trim();
            data.unit = fullUnit;
            if (data.unit.length > 150) data.unit = data.unit.substring(0, 150) + '...';
        } else {
            const lines = ocrText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            let potentialUnitLines = [];
            let capturing = false;

            for (const line of lines) {
                if ((line.includes('PENGAKAP') || line.includes('PEMIMPIN')) && !line.includes('Diberi kepada')) {
                    capturing = true;
                    potentialUnitLines.push(line);
                } else if (capturing) {
                    if (line.includes('DAERAH') || line.match(/(JOHOR|MELAKA|SABAH|SARAWAK|PERAK|KEDAH|PULAU PINANG|SELANGOR|NEGERI SEMBILAN|PAHANG|TERENGGANU|KELANTAN|PERLIS|KUALA LUMPUR|LABUAN|PUTRAJAYA)/i)) {
                        potentialUnitLines.push(line);
                    } else if (line.match(/(\d{6}-\d{2}-\d{4}|\d{12}|No\. Pendaftaran|Tarikh|Diberi kepada)/i)) {
                        capturing = false;
                        break;
                    } else {
                        if (potentialUnitLines.length > 0 && potentialUnitLines.join(' ').length < 150) {
                            potentialUnitLines.push(line);
                        } else {
                            capturing = false;
                            break;
                        }
                    }
                }
            }
            if (potentialUnitLines.length > 0) {
                data.unit = potentialUnitLines.join(' ').replace(/\s+/g, ' ').trim();
                if (data.unit.length > 150) data.unit = data.unit.substring(0, 150) + '...';
            }
        }

        const noPendaftaranMatch = ocrText.match(/No\. Pendaftaran\s*:\s*([A-Za-z]-\d{4,5})/i);
        if (noPendaftaranMatch) {
            data.noPendaftaran = noPendaftaranMatch[1].toUpperCase();
        }

        // Capture the full date (DD.MM.YYYY)
        const dateMatch = ocrText.match(/Tarikh\s*:\s*(\d{2}\.\d{2}\.\d{4})/i);
        if (dateMatch) {
            data.date = dateMatch[1];
        } else {
            const generalDateMatch = ocrText.match(/(\d{2}\.\d{2}\.\d{4})/);
            if (generalDateMatch) {
                data.date = generalDateMatch[0];
            }
        }

        let noSijilValue = null;
        const pkkMatch = ocrText.match(/(PKK\s*\d{3,4})/i);
        if (pkkMatch) {
            noSijilValue = pkkMatch[1].toUpperCase().replace(/\s/g, '');
        }
        if (!noSijilValue) {
            const noPrefixMatch = ocrText.match(/(No\s*\d{3,5})/i);
            if (noPrefixMatch) {
                noSijilValue = noPrefixMatch[1].toUpperCase().replace(/\s/g, '');
            }
        }
        if (!noSijilValue) {
            const lines = ocrText.split('\n').filter(line => line.trim() !== '');
            for (let i = lines.length - 1; i >= 0 && i > lines.length - 5; i--) {
                const lastWordMatch = lines[i].match(/(\d{4,5})\s*$/);
                if (lastWordMatch) {
                    if (!lastWordMatch[1].startsWith('19') && !lastWordMatch[1].startsWith('20') && !lines[i].includes('Tarikh')) {
                        noSijilValue = lastWordMatch[1];
                        break;
                    }
                }
            }
        }
        if (noSijilValue) {
            data.noSijil = noSijilValue;
        }

        return data;
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        // Basic form validation before submission
        if (!unit || !noSijil || !tahunLulus) {
            toast.warning("Maklumat Tidak Lengkap", {
                description: "Sila isi semua medan yang diperlukan (Unit, No. Sijil, Tarikh Lulus).",
            });
            setIsLoading(false);
            return;
        }

        // Client-side validation for DD.MM.YYYY format
        const datePattern = /^\d{2}\.\d{2}\.\d{4}$/;
        if (!tahunLulus.match(datePattern)) {
            toast.error("Format Tarikh Salah", {
                description: "Sila masukkan Tarikh Lulus dalam format DD.MM.YYYY (Contoh: 17.12.2009).",
            });
            setIsLoading(false);
            return;
        }

        // --- NEW: Convert tahunLulus from DD.MM.YYYY to YYYY-MM-DD for Supabase ---
        let formattedTahunLulus = tahunLulus;
        const dateParts = tahunLulus.split('.'); // e.g., ['17', '12', '2009']
        if (dateParts.length === 3) {
            const [day, month, year] = dateParts;
            formattedTahunLulus = `${year}-${month}-${day}`; // Converts to '2009-12-17'
        } else {
            // This else block should ideally not be hit if the datePattern regex is robust,
            // but it's here as a safeguard.
            console.warn("Invalid date format detected after client-side validation, sending as-is.");
            // You might want to throw an error or handle this more explicitly if it's a real concern.
        }
        // --- END NEW CONVERSION ---


        const result = await insertManikayuRecord({
            user_id: "264eb21d-4338-408d-a8a2-c86affebe0b4", // IMPORTANT: Replace with actual user ID from your auth system
            unit,
            noSijil,
            tahunLulus: formattedTahunLulus, // Use the converted YYYY-MM-DD format
            salinanSijil: imagePreviewUrl || salinanSijil,
        });

        if (result.success) {
            toast.success("Maklumat dihantar", {
                description: "Maklumat manikayu berjaya dihantar.",
                action: {
                    label: "OK",
                    onClick: () => console.log("Confirmed"),
                },
            });

            // Reset form fields
            setUnit("");
            setNoSijil("");
            setTahunLulus("");
            setSalinanSijil("");
            // Reset OCR-related states
            setImageFile(null);
            setImagePreviewUrl(null);
            setExtractedOcrData(null);
            setOcrError(null);

        } else {
            toast.error("Ralat semasa penghantaran", {
                description: result.error?.message ?? "Sila cuba sekali lagi.",
                action: {
                    label: "Tutup",
                    onClick: () => console.log("Tutup clicked"),
                },
            });
        }

        setIsLoading(false);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Tambah Manikayu</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Maklumat Manikayu Baharu</DialogTitle>
                    <DialogDescription>
                        Sila isikan maklumat manikayu anda dibawah atau muat naik sijil untuk ekstrak data secara automatik.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col md:flex-row gap-6 mt-4">
                    {/* Left Side: Upload & Preview */}
                    <div className="flex-1 flex flex-col gap-4 p-4 border rounded-md bg-gray-50">
                        <h3 className="text-lg font-semibold">Muat Naik Sijil</h3>

                        {/* Hidden file input */}
                        <Input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                            className="hidden"
                        />

                        {/* Image Container with Border */}
                        <div className="mt-2 p-2 border border-gray-300 rounded-md bg-white flex items-center justify-center"
                            style={{ minHeight: '180px', maxHeight: '300px', overflow: 'hidden' }}>
                            {imagePreviewUrl ? (
                                <img
                                    src={imagePreviewUrl}
                                    alt="Pratonton Sijil"
                                    className="max-w-full max-h-full object-contain rounded-sm"
                                />
                            ) : (
                                <p className="text-gray-500 text-sm text-center">
                                    Sila pilih imej sijil untuk pratonton di sini.<br />
                                    (PNG, JPG, JPEG)
                                </p>
                            )}
                        </div>

                        {ocrError && (
                            <p className="text-red-500 text-sm mt-2">{ocrError}</p>
                        )}

                        {/* Buttons Below Image Container, Aligned to Right */}
                        <div className="flex justify-end gap-2 mt-2">
                            <Button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                variant="outline"
                                disabled={isOcrProcessing}
                            >
                                Pilih Imej Sijil
                            </Button>
                            <Button
                                type="button"
                                onClick={performOcr}
                                disabled={!imageFile || isOcrProcessing}
                            >
                                {isOcrProcessing ? "Mengekstrak..." : "Ekstrak Data"}
                            </Button>
                        </div>
                    </div>

                    {/* Right Side: Extracted Data & Form Fields */}
                    <div className="flex-1 flex flex-col gap-4 p-4 border rounded-md bg-white">
                        <h3 className="text-lg font-semibold">Maklumat Sijil</h3>

                        {extractedOcrData && (
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                                <h4 className="text-md font-medium mb-2 text-blue-800">Data Diekstrak (Semak & Edit):</h4>
                                <ul className="text-sm space-y-1 text-blue-700">
                                    <li><strong>Unit:</strong> {extractedOcrData.unit || 'Tiada Data Ditemui'}</li>
                                    <li><strong>No. Sijil:</strong> {extractedOcrData.noSijil || 'Tiada Data Ditemui'}</li>
                                    <li><strong>Tarikh Lulus (dari Sijil):</strong> {extractedOcrData.date || 'Tiada Data Ditemui'}</li>
                                    {extractedOcrData.noPendaftaran && (
                                        <li><strong>No. Pendaftaran:</strong> {extractedOcrData.noPendaftaran}</li>
                                    )}
                                    {extractedOcrData.icNo && (
                                        <li><strong>No. KP:</strong> {extractedOcrData.icNo}</li>
                                    )}
                                </ul>
                                <p className="text-xs text-blue-600 mt-2">
                                    Medan borang di bawah telah dipenuhi secara automatik. Sila semak semula dan betulkan jika perlu.
                                </p>
                            </div>
                        )}
                        {!extractedOcrData && !isOcrProcessing && (
                            <div className="p-3 bg-gray-100 border border-gray-200 rounded-md text-sm text-gray-600">
                                <p>Muat naik imej sijil dan klik "Ekstrak Data" untuk mengisi medan ini secara automatik.</p>
                            </div>
                        )}

                        {/* Form Fields - on the right side */}
                        <TextInputField
                            id="unit"
                            label="Unit"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            required
                            disabled={isOcrProcessing || isLoading}
                            placeholder="PEMIMPIN PENGAKAP KANAK-KANAK..."
                        />

                        <div className="flex flex-col sm:flex-row w-full gap-5">
                            {/* DateInputField expects DD.MM.YYYY */}
                            <DateInputField
                                id="tahunLulus"
                                label="Tarikh Lulus (DD.MM.YYYY)"
                                value={tahunLulus}
                                onChange={(e) => setTahunLulus(e.target.value)}
                                required
                                disabled={isOcrProcessing || isLoading}
                                placeholder="Contoh: 17.12.2009"
                            />
                            <TextInputField
                                id="noSijil"
                                label="No. Sijil"
                                value={noSijil}
                                onChange={(e) => setNoSijil(e.target.value)}
                                required
                                disabled={isOcrProcessing || isLoading}
                                placeholder="Contoh: PKK1424 / 02790"
                            />
                        </div>

                        <TextInputField
                            id="salinanSijil"
                            label="Pautan Salinan Sijil (URL Imej)"
                            value={imagePreviewUrl || salinanSijil}
                            onChange={(e) => setSalinanSijil(e.target.value)}
                            disabled={true}
                            placeholder="Pautan ke imej sijil akan dipaparkan di sini"
                        />
                    </div>
                </div>

                <DialogFooter className="sm:justify-start mt-6">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleSubmit}
                        disabled={isLoading || isOcrProcessing}
                    >
                        {isLoading ? "Memproses..." : "Hantar"}
                    </Button>
                    <DialogClose asChild>
                        <Button type="button" variant="outline" disabled={isLoading || isOcrProcessing}>
                            Batal
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ManikayuCertificateOCR;
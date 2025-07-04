import React from "react";

export type ProfileContainerProps = {
  profileMenuTabHeader: string;
  children: React.ReactNode;
};

export function ProfileContainer({ profileMenuTabHeader, children }: ProfileContainerProps) {
  return (
    <div className="mt-5 px-8 py-4 border border-gray-400 rounded-md">
      <div className="mb-6 font-sans font-semibold">{profileMenuTabHeader}</div>
      {children}
    </div>
  );
}

export type ProfileSectionProps = {
  profileMenuTabHeader: string;
  items: { title: string; value: string | number }[];
};

export function ProfileSection({ profileMenuTabHeader, items }: ProfileSectionProps) {
  const firstItem = items[0];

  const groupItems = (items: typeof firstItem[], groupSize: number) => {
    let groups = [];
    for (let i = 0; i < items.length; i += groupSize) {
      groups.push(items.slice(i, i + groupSize));
    }
    return groups;
  };

  const remainingGroups = groupItems(items.slice(1), 3);

  return (
    <ProfileContainer profileMenuTabHeader={profileMenuTabHeader}>
      <div className="flex justify-between pr-15">
        <ProfileItemContainer>
          <ProfilItem title={firstItem.title} value={firstItem.value} />
        </ProfileItemContainer>
      </div>

      {remainingGroups.map((group, index) => (
        <div key={index} className="flex justify-between pr-80 mt-4">
          {group.map((item, itemIndex) => (
            <ProfileItemContainer key={itemIndex}>
              <ProfilItem title={item.title} value={item.value} />
            </ProfileItemContainer>
          ))}
        </div>
      ))}
    </ProfileContainer>
  );
}

export type ProfileItemContainerProps = {
  children: React.ReactNode;
};

export function ProfileItemContainer({ children }: ProfileItemContainerProps) {
  return <div className="w-[20%]">{children}</div>;
}

export type ProfileItemProps = {
  title: string;
  value: any;
};

export function ProfilItem({ title, value }: ProfileItemProps) {
  return (
    <div className="mb-1">
      <div className="mb-1 font-sans font-normal text-sm text-gray-600">{title}</div>
      <div className="font-sans font-normal text-sm text-black">{value}</div>
    </div>
  );
}

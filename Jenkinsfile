// Jenkinsfile for Next.js CI/CD Pipeline
pipeline {
    // Define the agent where the pipeline will run.
    // 'any' means Jenkins will pick any available agent.
    // For a more controlled environment, you could use a Docker agent
    // like 'agent { docker { image 'node:18-alpine' } }'
    agent any

    // Define tools required for the pipeline.
    // 'Node 22.3' should match the name configured in Jenkins Global Tool Configuration.
    tools {
        nodejs 'Node 22.3' // <--- ENSURE THIS NAME MATCHES YOUR JENKINS CONFIG EXACTLY
    }

     environment {
        NODE_OPTIONS = '--max-old-space-size=4096'
        // Add your Supabase environment variables here
        // IMPORTANT: Replace with your actual Supabase URL and Anon Key
        NEXT_PUBLIC_SUPABASE_URL = 'https://uhywazmkjkmjmodxangg.supabase.co' // Replace with your Supabase URL
        NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoeXdhem1ramttam1vZHhhbmdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNjQ1NTksImV4cCI6MjA1OTg0MDU1OX0.xWlwGIJHXxK1aXS2v6t-SEtxIEqhwzNF45r-a7SA4Ho' // Replace with your Supabase Anon Key
        // If you have a service role key, DO NOT expose it in the frontend build.
        // Only use NEXT_PUBLIC_... variables for client-side accessible keys.
    }

    // Define the stages of your CI/CD pipeline.
    stages {
        // Stage 1: Checkout the source code from GitHub.
        stage('Checkout') {
            steps {
                // Use the Git SCM step to clone the repository.
                // 'main' is the branch, 'github-pat' is the credential ID configured in Jenkins.
                git branch: 'main', credentialsId: 'github-pat', url: 'https://github.com/FahmiRoslee/SC-PROJECT.git' // <--- YOUR REPO URL
            }
        }

        // NEW STAGE: Clean Workspace
        stage('Clean Workspace') {
            steps {
                script {
                    // Delete .next folder (build output and cache)
                    bat 'rmdir /s /q .next || exit 0' // '|| exit 0' prevents failure if folder doesn't exist
                    // Delete node_modules folder (all installed dependencies)
                    bat 'rmdir /s /q node_modules || exit 0'
                    // Delete package-lock.json (dependency lock file)
                    bat 'del package-lock.json || exit 0'
                    // If you use yarn, also delete yarn.lock:
                    // bat 'del yarn.lock || exit 0'
                }
            }
        }

        // Stage 2: Install Node.js dependencies.
        stage('Install Dependencies') {
            steps {
                script {
                    // Use 'bat' for Windows batch commands.
                    // 'npm install' downloads and installs all project dependencies.
                    bat 'npm install'
                    // If you are using Yarn, replace 'npm install' with 'yarn install'
                    // bat 'yarn install'
                }
            }
        }

        // Stage 3: Run tests.
        // // Assuming your Next.js project has tests configured (e.g., with Jest).
        // // If you don't have tests, you can comment out this entire stage.
        // stage('Run Tests') {
        //     steps {
        //         script {
        //             // 'npm test' executes the tests defined in your package.json.
        //             bat 'npm test'
        //             // If you are using Yarn, replace 'npm test' with 'yarn test'
        //             // bat 'yarn test'
        //         }
        //     }
        // }

        // Stage 4: Build the Next.js application for production.
        stage('Build Next.js App') {
            steps {
                script {
                    // 'npm run build' compiles and optimizes your Next.js application.
                    bat 'npm run build'
                    // If you are using Yarn, replace 'npm run build' with 'yarn build'
                    // bat 'yarn build'
                }
            }
        }

        // Stage 5: Build the Docker image for your Next.js application.
        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image using the Dockerfile in the project root.
                    // Tag the image with your Docker Hub username and repository name.
                    bat 'docker build -t your-dockerhub-username/your-nextjs-app:latest .' // <--- YOUR DOCKER HUB USERNAME/REPO
                }
            }
        }

        // Stage 6: Push the Docker image to Docker Hub.
        stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    // Use 'withCredentials' to securely access Docker Hub credentials.
                    // 'dockerhub-credentials' is the ID configured in Jenkins.
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                        // Log in to Docker Hub.
                        bat "docker login -u %DOCKER_USERNAME% -p %DOCKER_PASSWORD%"
                        // Push the tagged image to Docker Hub.
                        bat 'docker push your-dockerhub-username/your-nextjs-app:latest' // <--- YOUR DOCKER HUB USERNAME/REPO
                    }
                }
            }
        }

        // Stage 7: Deploy the application to Kubernetes.
        // This assumes kubectl is available on the Jenkins agent and configured to access your cluster.
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Apply the Kubernetes deployment and service configurations.
                    // Ensure 'k8s/deployment.yaml' and 'k8s/service.yaml' exist in your repo.
                    bat 'kubectl apply -f k8s/deployment.yaml'
                    bat 'kubectl apply -f k8s/service.yaml'
                }
            }
        }
    }

    // Post-build actions (e.g., notifications, cleanup).
    post {
        always {
            // Optional: You can add steps here to notify Jira about the build status.
            // Example (requires Jira plugin configuration):
            // jiraIssueUpdater issueId: 'YOUR_JIRA_ISSUE_ID', result: currentBuild.result
            echo "Pipeline finished with status: ${currentBuild.result}"
        }
    }
}
// Jenkinsfile for Next.js CI/CD Pipeline
pipeline {
    agent any
    tools {
        nodejs 'Node 22.3' // Use the exact name you configured in Jenkins
    }
    environment {
        NODE_OPTIONS = '--max-old-space-size=4096'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', credentialsId: 'github-pat', url: 'https://github.com/FahmiRoslee/SC-PROJECT.git'
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
        // ... rest of your stages ...
        stage('Install Dependencies') {
            steps {
                script {
                    bat 'npm install'
                }
            }
        }
        // ... and so on ...
    }
    post {
        always {
            echo "Pipeline finished with status: ${currentBuild.result}"
        }
    }
}
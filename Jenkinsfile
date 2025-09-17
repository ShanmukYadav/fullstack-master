pipeline {
    agent any

    environment {
        // Force Jest/React-Scripts to run in CI mode (no watch)
        CI = 'true'
    }

    tools {
        nodejs "NodeJS" // Make sure your Jenkins NodeJS tool is named exactly "NodeJS"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/ShanmukYadav/fullstack-master.git'
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    bat 'npm install --no-audit --no-fund'
                }
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    bat 'npm install --no-audit --no-fund'
                }
            }
        }

        stage('Run Frontend Tests') {
            steps {
                dir('frontend') {
                    // Run frontend tests once and exit
                    bat 'npm test -- --passWithNoTests --watchAll=false'
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                dir('backend') {
                    // Run backend tests normally; failures will fail the build
                    bat 'npm test'
                }
            }
        }
    }
}

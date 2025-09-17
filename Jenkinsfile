pipeline {
    agent any

    environment {
        CODACY_PROJECT_TOKEN = credentials('codacy-project-token')   // store your token in Jenkins Credentials
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/ShanmukYadav/fullstack-master.git',
                    credentialsId: 'github-pat-global'
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Run Frontend Tests') {
            steps {
                dir('frontend') {
                    sh 'npm test -- --coverage'
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                dir('backend') {
                    sh 'npm test -- --coverage'
                }
            }
        }

        stage('Install Codacy Reporter') {
            steps {
                sh 'bash <(curl -Ls https://coverage.codacy.com/get.sh)'
            }
        }

        stage('Check Codacy Token') {
            steps {
                sh 'if [ -z "$CODACY_PROJECT_TOKEN" ]; then echo "❌ Codacy token missing"; exit 1; else echo "✅ Codacy token available"; fi'
            }
        }

        stage('Upload Coverage to Codacy') {
            steps {
                sh '''
                    ./codacy-coverage-reporter report -l JavaScript -r frontend/coverage/lcov.info
                    ./codacy-coverage-reporter report -l JavaScript -r backend/coverage/lcov.info
                '''
            }
        }
    }
}

pipeline {
    agent any

    environment {
        CI = 'true'
        MONGO_URI = 'mongodb+srv://anishningala2018_db_user:Anish0204@lostandfound.1sduv0o.mongodb.net/?retryWrites=true&w=majority&appName=lostandfound'
    }

    tools {
        nodejs "NodeJS" // Ensure Jenkins NodeJS tool is named exactly "NodeJS"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'test',
                    url: 'https://github.com/ShanmukYadav/fullstack-master.git',
                    credentialsId: 'github-pat-global'
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
                    bat 'npm test -- --passWithNoTests --watchAll=false --coverage'
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                dir('backend') {
                    withEnv(["MONGO_URI=${env.MONGO_URI}"]) {
                        // Windows: ensure local node_modules binaries can run
                        bat 'npx cross-env NODE_ENV=test jest --detectOpenHandles --forceExit --coverage'
                    }
                }
            }
        }

        stage('Install Codacy Reporter') {
            steps {
                bat 'powershell -Command "Invoke-Expression (Invoke-WebRequest https://coverage.codacy.com/get.sh -UseBasicParsing).Content"'
            }
        }

        stage('Upload Coverage to Codacy') {
            steps {
                withCredentials([string(credentialsId: 'CODACY_PROJECT_TOKEN', variable: 'CODACY_PROJECT_TOKEN')]) {
                    dir('frontend') {
                        bat 'codacy-coverage-reporter report -l JavaScript -r coverage\\lcov.info'
                    }
                    dir('backend') {
                        bat 'codacy-coverage-reporter report -l JavaScript -r coverage\\lcov.info'
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Build finished.'
        }
    }
}

pipeline {
    agent any

    environment {
        CI = 'true'
        MONGO_URI = 'mongodb+srv://anishningala2018_db_user:Anish0204@lostandfound.1sduv0o.mongodb.net/?retryWrites=true&w=majority&appName=lostandfound'
    }

    tools {
        nodejs "NodeJS" // Make sure Jenkins NodeJS tool is configured
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
                    sh 'npm install --no-audit --no-fund'
                }
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install --no-audit --no-fund'
                }
            }
        }

        stage('Run Frontend Tests') {
            steps {
                dir('frontend') {
                    sh 'npm test -- --passWithNoTests --watchAll=false --coverage'
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                dir('backend') {
                    withEnv(["MONGO_URI=${env.MONGO_URI}"]) {
                        sh 'chmod -R +x node_modules/.bin'
                        sh 'npx cross-env NODE_ENV=test jest --detectOpenHandles --forceExit --coverage'
                    }
                }
            }
        }

        stage('Install Codacy Reporter') {
            steps {
                sh 'curl -Ls https://coverage.codacy.com/get.sh | bash'
            }
        }

        stage('Upload Coverage to Codacy') {
            steps {
                withCredentials([string(credentialsId: 'CODACY_PROJECT_TOKEN', variable: 'CODACY_PROJECT_TOKEN')]) {
                    sh 'chmod +x ~/.cache/codacy/coverage-reporter/*/codacy-coverage-reporter'

                    dir('frontend') {
                        sh '~/.cache/codacy/coverage-reporter/*/codacy-coverage-reporter report -l JavaScript -r coverage/lcov.info -t $CODACY_PROJECT_TOKEN'
                    }

                    dir('backend') {
                        sh '~/.cache/codacy/coverage-reporter/*/codacy-coverage-reporter report -l JavaScript -r coverage/lcov.info -t $CODACY_PROJECT_TOKEN'
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

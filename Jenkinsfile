pipeline {
    agent any

    environment {
        CI = 'true'
        MONGO_URI = 'mongodb+srv://anishningala2018_db_user:Anish0204@lostandfound.1sduv0o.mongodb.net/?retryWrites=true&w=majority&appName=lostandfound'
    }

    tools {
        nodejs "NodeJS" // Make sure your Jenkins NodeJS tool is named exactly "NodeJS"
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
                // Install reporter (Linux compatible)
                sh 'curl -Ls https://coverage.codacy.com/get.sh | bash'
            }
        }

        stage('Upload Coverage to Codacy') {
            steps {
                // Use Jenkins credentials for Codacy token
                withCredentials([string(credentialsId: '4354e6b5e18248c493819265d09f5408', variable: '4354e6b5e18248c493819265d09f5408')]) {
                    
                    // Upload frontend coverage
                    dir('frontend') {
                        sh '''
                        if [ -f coverage/lcov.info ]; then
                            ~/.cache/codacy/coverage-reporter/codacy-coverage-reporter report \
                                -l JavaScript \
                                -r coverage/lcov.info \
                                -t $CODACY_PROJECT_TOKEN
                        else
                            echo "No frontend coverage found."
                        fi
                        '''
                    }

                    // Upload backend coverage
                    dir('backend') {
                        sh '''
                        if [ -f coverage/lcov.info ]; then
                            ~/.cache/codacy/coverage-reporter/codacy-coverage-reporter report \
                                -l JavaScript \
                                -r coverage/lcov.info \
                                -t $CODACY_PROJECT_TOKEN
                        else
                            echo "No backend coverage found."
                        fi
                        '''
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                echo 'Build finished.'
            }
        }
    }
}

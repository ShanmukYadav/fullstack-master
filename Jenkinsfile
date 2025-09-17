pipeline {
    agent any

    environment {
        CODACY_PROJECT_TOKEN = credentials('codacy-project-token')   // Codacy token stored in Jenkins
        GITHUB_PAT = credentials('github-pat-global')               // GitHub PAT stored in Jenkins
    }

    stages {
        // --------------------
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/ShanmukYadav/fullstack-master.git',
                    credentialsId: 'github-pat-global'
            }
        }

        // --------------------
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

        // --------------------
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

        // --------------------
        stage('Install Codacy Reporter') {
            steps {
                sh 'bash <(curl -Ls https://coverage.codacy.com/get.sh)'
            }
        }

        stage('Check Codacy Token') {
            steps {
                sh '''
                    if [ -z "$CODACY_PROJECT_TOKEN" ]; then
                        echo "❌ Codacy token missing"
                        exit 1
                    else
                        echo "✅ Codacy token available"
                    fi
                '''
            }
        }

        stage('Upload Coverage to Codacy') {
            steps {
                sh '''
                    # Upload frontend coverage
                    if [ -f frontend/coverage/lcov.info ]; then
                        ./codacy-coverage-reporter report -l JavaScript -r frontend/coverage/lcov.info
                    fi

                    # Upload backend coverage
                    if [ -f backend/coverage/lcov.info ]; then
                        ./codacy-coverage-reporter report -l JavaScript -r backend/coverage/lcov.info
                    fi
                '''
            }
        }
    }

    post {
        always {
            echo '✅ Pipeline finished!'
        }
        failure {
            echo '❌ Pipeline failed. Check logs above for details.'
        }
    }
}

pipeline {
    agent any

    environment {
        CODACY_PROJECT_TOKEN = credentials('codacy-project-token')
    }

    parameters {
        string(name: 'BRANCH', defaultValue: 'main', description: 'Git branch to build')
    }

    tools {
        nodejs 'NodeJS' // Name of your NodeJS installation in Jenkins
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout([$class: 'GitSCM',
                    branches: [[name: "*/${params.BRANCH}"]],
                    doGenerateSubmoduleConfigurations: false,
                    extensions: [],
                    userRemoteConfigs: [[url: 'https://github.com/ShanmukYadav/fullstack-master.git']]
                ])
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
                    sh 'chmod -R +x node_modules/.bin'
                    sh 'npx cross-env NODE_ENV=test jest --detectOpenHandles --forceExit --coverage'
                }
            }
        }

        stage('Fix Coverage Paths (Windows)') {
            steps {
                dir('frontend') {
                    // Convert Windows backslashes to forward slashes for Codacy
                    sh "sed -i 's|\\\\|/|g' coverage/lcov.info"
                }
            }
        }

        stage('Upload Coverage to Codacy') {
            steps {
                dir('.') {
                    sh '''
                    bash <(curl -Ls https://coverage.codacy.com/get.sh) \
                        report -r frontend/coverage/lcov.info \
                        -t $CODACY_PROJECT_TOKEN
                    '''
                }
            }
        }
    }

    post {
        always {
            script {
                echo "Cleaning up workspace..."
                cleanWs()
            }
        }
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed. Check logs!"
        }
    }
}

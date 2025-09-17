pipeline {
    agent any

    parameters {
        string(name: 'BRANCH_NAME', defaultValue: 'main', description: 'Branch to build')
    }

    environment {
        CODACY_PROJECT_TOKEN = credentials('codacy-project-token')
        NODEJS_HOME = tool name: 'NodeJS', type: 'NodeJSInstallation'
        PATH = "${NODEJS_HOME}/bin:${env.PATH}"
    }

    stages {

        stage('Checkout SCM') {
            steps {
                echo "Checking out branch: ${params.BRANCH_NAME}"
                checkout([$class: 'GitSCM',
                    branches: [[name: "*/${params.BRANCH_NAME}"]],
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
                    sh '''
                        chmod -R +x node_modules/.bin
                        npx cross-env NODE_ENV=test jest --detectOpenHandles --forceExit --coverage
                    '''
                }
            }
        }

        stage('Upload Coverage to Codacy') {
            steps {
                dir('.') {
                    sh '''
                        #!/bin/bash
                        echo "Uploading coverage to Codacy..."
                        npx codacy-coverage --token "$CODACY_PROJECT_TOKEN"
                    '''
                }
            }
        }
    }

    post {
        always {
            echo "Cleaning up workspace..."
            cleanWs()
        }
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed. Check logs!"
        }
    }
}

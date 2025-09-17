pipeline {
    agent any

    environment {
        NODEJS_HOME = tool name: 'NodeJS'   // Set your NodeJS tool name in Jenkins
        PATH = "${NODEJS_HOME}/bin:${env.PATH}"
        CODACY_PROJECT_TOKEN = credentials('codacy-project-token') // Your Codacy token
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'test', url: 'https://github.com/ShanmukYadav/fullstack-master.git'
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

        stage('Upload Coverage to Codacy') {
            steps {
                // This will download and run Codacy reporter
                sh 'bash <(curl -Ls https://coverage.codacy.com/get.sh)'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs.'
        }
    }
}

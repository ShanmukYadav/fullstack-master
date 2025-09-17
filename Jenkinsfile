pipeline {
    agent any

    environment {
        NODEJS_HOME = tool name: 'NodeJS', type: 'NodeJSInstallation'
        PATH = "${NODEJS_HOME}/bin:${env.PATH}"
        CODACY_PROJECT_TOKEN = credentials('codacy-project-token')
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
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
                sh '''
                # Use bash-compatible syntax
                curl -Ls https://coverage.codacy.com/get.sh | bash
                '''
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

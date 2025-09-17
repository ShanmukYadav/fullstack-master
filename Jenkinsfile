pipeline {
    agent any

    environment {
        CI = 'true'
        // MongoDB Atlas connection for backend tests
        MONGO_URI = 'mongodb+srv://anishningala2018_db_user:Anish0204@lostandfound.1sduv0o.mongodb.net/?retryWrites=true&w=majority&appName=lostandfound'
    }

    tools {
        nodejs "NodeJS" // Make sure your Jenkins NodeJS tool is named exactly "NodeJS"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/ShanmukYadav/fullstack.git',
                    credentialsId: 'github-pat-global' // Use your GitHub PAT
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
                    sh 'npm test -- --passWithNoTests --watchAll=false'
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                dir('backend') {
                    withEnv(["MONGO_URI=${env.MONGO_URI}"]) {
                        // Use npx to run cross-env on Linux
                        sh 'npx cross-env NODE_ENV=test jest --detectOpenHandles --forceExit'
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

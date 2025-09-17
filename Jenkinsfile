pipeline {
    agent any

    environment {
        CI = 'true'
        MONGO_URI = 'mongodb+srv://anishningala2018_db_user:Anish0204@lostandfound.1sduv0o.mongodb.net/?retryWrites=true&w=majority&appName=lostandfound' // MongoDB connection for backend tests
    }

    tools {
        nodejs "NodeJS" // Make sure your Jenkins NodeJS tool is named exactly "NodeJS"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'test',
                    url: 'https://github.com/ShanmukYadav/fullstack-master.git'
            }
        }

        stage('Start MongoDB') {
            steps {
                script {
                    // Start MongoDB Docker container
                    bat 'docker run --name mongo-test -d -p 27017:27017 mongo:6.0'
                    // Wait a few seconds to ensure MongoDB is ready
                    sleep 10
                }
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
                    bat 'npm test -- --passWithNoTests --watchAll=false'
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                dir('backend') {
                    // Pass MongoDB URI to tests via environment variable
                    bat 'set MONGO_URI=%MONGO_URI% && npm test'
                }
            }
        }
    }

    post {
        always {
            script {
                // Stop and remove MongoDB container after tests
                bat 'docker stop mongo-test && docker rm mongo-test'
            }
        }
    }
}

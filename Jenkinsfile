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
                    sh 'npm test -- --passWithNoTests --watchAll=false'
                }
            }
        }

       stage('Run Backend Tests') {
    steps {
        dir('backend') {
            withEnv(["MONGO_URI=${env.MONGO_URI}"]) {
                // Make all node_modules/.bin executables runnable
                sh 'chmod -R +x node_modules/.bin'
                
                // Run backend tests
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

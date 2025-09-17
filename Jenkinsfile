pipeline {
    agent any

    environment {
        CI = 'true'
        MONGO_URI = 'mongodb+srv://anishningala2018_db_user:Anish0204@lostandfound.1sduv0o.mongodb.net/?retryWrites=true&w=majority&appName=lostandfound'
    }

    tools {
        nodejs "NodeJS"
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
                    bat 'npm test -- --passWithNoTests --watchAll=false --coverage'
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                dir('backend') {
                    withEnv(["MONGO_URI=${env.MONGO_URI}"]) {
                        bat 'npx cross-env NODE_ENV=test jest --detectOpenHandles --forceExit --coverage'
                    }
                }
            }
        }

        stage('Install Codacy Reporter') {
            steps {
                bat 'curl -Ls https://coverage.codacy.com/get.sh | bash'
            }
        }

        stage('Upload Coverage to Codacy') {
            steps {
                withCredentials([string(credentialsId: 'CODACY_PROJECT_TOKEN', variable: 'CODACY_PROJECT_TOKEN')]) {
                    script {
                        def reporterPath = bat(
                            script: "for /f %i in ('dir /b /ad /o-n %USERPROFILE%\\.cache\\codacy\\coverage-reporter') do @echo %USERPROFILE%\\.cache\\codacy\\coverage-reporter\\%i",
                            returnStdout: true
                        ).trim()

                        dir('frontend') {
                            bat """
                                echo Uploading frontend coverage...
                                ${reporterPath}\\codacy-coverage-reporter.exe report ^
                                  --language JavaScript ^
                                  --report coverage/lcov.info ^
                                  --project-token %CODACY_PROJECT_TOKEN%
                            """
                        }

                        dir('backend') {
                            bat """
                                echo Uploading backend coverage...
                                ${reporterPath}\\codacy-coverage-reporter.exe report ^
                                  --language JavaScript ^
                                  --report coverage/lcov.info ^
                                  --project-token %CODACY_PROJECT_TOKEN%
                            """
                        }
                    }
                }
            }
        }
    }
}

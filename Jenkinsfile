pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building the application'
                script {
                    sh 'docker compose build frontend backend'
                }
            }
            post {
                success {
                    echo 'Build Success!'
                }
                failure {
                    echo 'Build Failed'
                }
            }
        }
        
        stage('Snyk Scanning for Vulnerabilities') { 
             parallel {
                stage('Client Snyk Scanning') {
                    steps {
                        dir('client') {
                            snykSecurity(
                                snykInstallation: 'SnykLatest',
                                snykTokenId: 'Snyk',
                                targetFile: 'package.json',
                                projectName: 'TickyTocky-Client', 
                                severity: 'high',
                                failOnIssues: 'false',
                                failOnError: 'false'
                            )
                        }
                    }
                }
                stage('Server Snyk Scanning') {
                    steps {
                        dir('server') {
                            snykSecurity(
                                snykInstallation: 'SnykLatest',
                                snykTokenId: 'Snyk',
                                targetFile: 'package.json',
                                projectName: 'TickyTocky-Server', 
                                severity: 'high',
                                failOnIssues: 'false',
                                failOnError: 'false'
                            )
                        }
                    }
                }
            }
        }

        // stage('Frontend Selenium Tests') {
        //     steps {
        //         dir('client') {
        //             script {
        //                 try {
        //                     sh 'npm install selenium-webdriver'
        //                     sh 'npm test'
        //                 } catch (Exception e) {
        //                     echo "An error occurred during the frontend tests: ${e.message}"
        //                     currentBuild.result = 'FAILURE' // Set the build result to FAILURE
        //                 }
        //             }
        //         }
        //     }
        //     post {
        //         success {
        //             echo 'Passed with flying colors'
        //         }
        //         failure {
        //             echo 'Frontend Test Failed'
        //         }
        //     }
        // }
        
        stage('Backend Unit Tests') {
            steps {
                dir('server') {
                    script {
                        sh 'apt install -y nodejs npm'
                        sh 'npm install -D mocha chai sinon'
                        sh 'npm test'
                    }
                }
            }
            post {
                success {
                    echo 'Passed with flying colors'
                }
                failure {
                    echo 'Backend Test Failed'
                }
            }
        }

        stage('OWASP DependencyCheck') { // save time not running
           steps {
               dependencyCheck additionalArguments: '--format HTML --format XML', odcInstallation: 'Default'
           }
        }
        
        stage('Deploy') {
            steps {
                dir('server') {
                    script {
                       withCredentials([string(credentialsId: 'DB_USER', variable: 'DB_USER'), string(credentialsId: 'DB_PASS', variable: 'DB_PASS')
                       , string(credentialsId: 'EMAIL_NAME', variable: 'EMAIL_NAME'), string(credentialsId: 'EMAIL_USER', variable: 'EMAIL_USER'), string(credentialsId: 'EMAIL_PASS', variable: 'EMAIL_PASS')
                       , string(credentialsId: 'SECRET', variable: 'SECRET'), string(credentialsId: 'CRYPTOSECRET', variable: 'CRYPTOSECRET')]) {
                            // Check if the .env file already exists
                            def envContent = "DB_USER=$DB_USER\nDB_PASS=$DB_PASS\nEMAIL_NAME=$EMAIL_NAME\nEMAIL_USER=$EMAIL_USER\nEMAIL_PASS=$EMAIL_PASS\nSECRET=$SECRET\nCRYPTOSECRET=$CRYPTOSECRET"
                
                            if (!fileExists('.env') || !sh(script: "echo '$envContent' | cmp -s - .env", returnStatus: true)) {
                                echo 'Creating .env file with credentials'
                                sh "echo '$envContent' > .env"
                            } else {
                                echo '.env file already contains the required content'
                            }

                            // try {
                            //     //echo 'Starting the server'
                            //     sh 'docker container stop frontend backend' // Stop the frontend and backend containers
                            //     sh 'docker container rm -f frontend backend' // Remove the frontend and backend containers
                            //     sh 'docker compose up -d --force-recreate frontend backend' // Recreate frontend and backend containers
                            // } catch (Exception e) {
                            //     echo "An error occurred during deployment: ${e.message}"
                            //     currentBuild.result = 'SUCCESS' // Set the build result to FAILURE
                            // }
                      }
                   }
                }
            }
            post {
                success {
                    echo 'Deployment successful'
                }
                failure {
                    echo 'Deployment failed'
                }
            }
        }
    }

    // Global success and failure conditions for the entire pipeline
    post {
        success {
            dependencyCheckPublisher pattern: 'dependency-check-report.xml'
            echo "Pipeline successfully completed."
            sh 'docker system prune -f' // Temp cleaning of images
            echo "Removed Old Containers and Images"
        }
        failure {
            echo "Pipeline failed. Please investigate."
            sh 'docker system prune -f' // Temp cleaning of images
        }
    }
}

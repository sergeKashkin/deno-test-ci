pipeline {
    agent any

    stages {
        stage('checkout') {
            steps {
                git url: 'https://github.com/sergeKashkin/deno-test-ci.git', branch: 'master'
            }
        }
        
        stage('determine changes') {
            steps {
                script {
                    def changes = sh(script: "git diff --name-only HEAD~1 HEAD", returnStdout: true).trim().split("\n")
                    
                    // Check if the build was triggered manually
                    env.MANUAL_TRIGGER = currentBuild.getBuildCauses().toString().contains("UserIdCause") ? 'true' : 'false'
                    
                    // Determine if there are changes in backend or frontend directories
                    env.BUILD_BACKEND = (changes.any { it.startsWith('be/') } || env.MANUAL_TRIGGER == 'true') ? 'true' : 'false'
                    env.BUILD_FRONTEND = (changes.any { it.startsWith('fe/') } || env.MANUAL_TRIGGER == 'true') ? 'true' : 'false'
                }
            }
        }
        
        stage('build be') {
            when {
                expression { env.BUILD_BACKEND == 'true' }
            }
            steps {
              dir('be') {
                    script {
                        docker.build('deno-app-image', '-f Dockerfile .')
                    }
                    echo 'Image built.'
                } 
            }
        }

        stage('run be app and tests in docker') {
            steps {
                script {
                    docker.image('deno-app-image').inside {
                        dir('be') {
                             // start app
                            sh 'deno task start &'
                            sleep(time: 5) // wait for the app to start
                            
                            // run tests
                             sh '''
                            deno task test > test_output.txt
                            TEST_EXIT_CODE=$?
                            
                            if [ $TEST_EXIT_CODE -ne 0 ]; then
                                echo "Tests failed!"
                                cat test_output.txt
                                exit $TEST_EXIT_CODE
                            fi
                            '''
                            
                            // run benchmark
                            sh 'deno task bench > bench_output.txt'
                            
                            sh '''
                                cp test_output.txt $WORKSPACE/test_output.txt
                                cp bench_output.txt $WORKSPACE/bench_output.txt
                            '''
                        }
                       
                    }
                }
            }
        }
        
        stage ('build fe') {
            when {
                expression { env.BUILD_FRONTEND == 'true' }
            }
            steps {
                dir('fe') {
                    script {
                        docker.build('next-app-image', '-f Dockerfile .')
                    }
                }
            }
        }

        stage('test fe') {
            when {
                expression { env.BUILD_FRONTEND == 'true' }
            }
            steps {
                dir('fe') {
                    script {
                        // Build the image up to the `tester` stage
                        def testingImage = docker.build('next-app-image-tester', '--target tester .')
                        
                        sh "docker ps -a --format '{{.Names}}' | grep -w fe_test_container && docker rm fe_test_container || true"

                        // Run tests in the container and save output to a file
                        sh "docker run --name fe_test_container next-app-image-tester yarn test > fe_test_output.txt 2>&1"
                        
                        // Cleanup: Remove the container
                        sh "docker rm fe_test_container"
                        
                        // Archive the test output file in Jenkins for viewing
                        archiveArtifacts artifacts: 'fe_test_output.txt', allowEmptyArchive: true
                    }
                }
            }
        }

        stage('archive test results') {
            steps {
                archiveArtifacts artifacts: 'test_output.txt, bench_output.txt', allowEmptyArchive: true
            }
        }
        
        stage('deploy') {
            steps {
                script {
                    def AWS_REGION = "${env.AWS_DEFAULT_REGION}"
                    def ECR_REPO_NAME = "${env.ECR_REPO_NAME}"
                    def AWS_ACCOUNT_ID = "${env.AWS_ACCOUNT_ID}"
                    echo "Deploying to ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}"
                    
                    def BE_IMAGE_TAG = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}:backend-latest"
                    def FE_IMAGE_TAG = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}:frontend-latest"
                    
                    echo 'Logging in to AWS ECR...'
                    sh """
                        aws ecr get-login-password --region ${AWS_REGION} | \
                        docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                    """
                    
                    echo 'Tagging and pushing images to ECR...'
                    sh """
                        docker tag deno-app-image ${BE_IMAGE_TAG}
                        docker tag next-app-image ${FE_IMAGE_TAG}
                        docker push ${BE_IMAGE_TAG}
                        docker push ${FE_IMAGE_TAG}
                    """
                }
            }
        }
        
        stage('run new version') {
            // Connect to server and restart
        }
    }
    
    post {
        success {
            echo 'Success!'
        }
        
        failure {
            echo 'Failure!'
        }
    }
}

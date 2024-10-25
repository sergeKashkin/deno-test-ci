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
        
        stage('archive test results') {
            steps {
                archiveArtifacts artifacts: 'test_output.txt, bench_output.txt', allowEmptyArchive: true
            }
        }
        
        stage('report test and benchmark results') {
                steps {
                    script {
                        // Check if test and benchmark result files exist
                        sh '''
                        if [ -f test_output.txt ]; then
                            echo "Test output exists."
                        else
                            echo "Test output does not exist!"
                            exit 1
                        fi
                        
                        if [ -f bench_output.txt ]; then
                            echo "Benchmark output exists."
                        else
                            echo "Benchmark output does not exist!"
                            exit 1
                        fi
                        '''
                    }
                }
        }
        
        stage('deploy') {
            steps {
                echo 'Deploying...'
            }
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

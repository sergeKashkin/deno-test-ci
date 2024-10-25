pipeline {
    agent any

    stages {
        stage('checkout') {
            steps {
                git url: 'https://github.com/sergeKashkin/deno-test-ci.git', branch: 'master'
            }
        }
        
        stage('build') {
            steps {
                script {
                    sh 'cd ./be'
                    docker.build('deno-app-image', '-f Dockerfile .')
                }
                echo 'Image built.'
            }
        }
        
        stage('run app and tests in docker') {
            steps {
                script {
                    docker.image('deno-app-image').inside {
                        // start app
                        sh 'deno task start &'
                        sleep(time: 5) // wait for the app to start
                        
                        // run tests
                        sh '''
                        deno task test > test_output.txt
                        if [ $TEST_EXIT_CODE -ne 0 ]; then
                            echo "Tests failed!"
                            cat test_output.txt
                            exit $TEST_EXIT_CODE
                        fi
                        '''
                        
                        // run benchmark
                        sh 'deno task bench | tee bench_output.txt'
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

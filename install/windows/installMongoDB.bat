@echo off

rem 1. Open an Administrator command prompt (or execute with Administrator privileges)
rem Check elevated permissions
net session >nul 2>&1
if %errorLevel% neq 0 (
	echo ERROR: You need to execute this script as Administrator
	cmd /k
	exit /b 0
)
rem Delete MongoDB service (in case of error during previous instalation)
net stop MongoDB >nul
sc.exe delete MongoDB >nul

rem 2. Create directories
mkdir c:\data\db >nul
mkdir c:\data\log >nul

rem 3. Create configuration file
if not exist "C:\Program Files\MongoDB\Server\3.6\mongod.cfg" (
	xcopy %~dp0"mongod.cfg" "C:\Program Files\MongoDB\Server\3.6"
)

rem 4. Create the MongoDB service
sc.exe create MongoDB binPath= "\"C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe\" --service --config=\"C:\Program Files\MongoDB\Server\3.6\mongod.cfg\"" DisplayName= "MongoDB" start= "auto"

rem 5. Start the MongoDB service
net start MongoDB >nul
if %errorLevel% neq 0 (
	echo ERROR: Bad service start for MongoDB
	net stop MongoDB >nul
	sc.exe delete MongoDB >nul
	echo Installing process aborted
	cmd /k
	exit /b 0
)

rem 6. Verify that MongoDB has started successfully
find "waiting for connections on port 27017" "c:\data\log\mongod.log" >nul
if %errorLevel% neq 0 (
	echo ERROR: MongoDB hasn't started correctly. Please re-execute this script
	cmd /k
	exit /b 0
)

rem 7. Connect to MongoDB
rem echo.
rem echo "To connect to MongoDB through the ~bi.mongo.exe shell, open another Command Prompt:"
rem echo "C:\Program Files\MongoDB\Server\3.6\bin\mongo.exe"

rem 8. Stop or remove the MongoDB service as needed
echo.
echo To stop the MongoDB service, use the following command:
echo net stop MongoDB
echo.
echo To remove the MongoDB service, first stop the service and then run the following command:
echo sc.exe delete MongoDB

echo.
echo. MongoDB instalation (as a service) was successfull!
cmd /k

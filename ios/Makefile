build:
	xcodebuild -project FieldKit.xcodeproj -scheme FieldKit -sdk iphoneos -configuration Release archive -archivePath /Users/jlewallen/fieldkit/app/ios/build/FieldKit.xcarchive

archive:
	#xcodebuild -exportArchive -archivePath /Users/jlewallen/fieldkit/app/ios/build/FieldKit.xcarchive -exportOptionsPlist exportOptions.plist -exportPath /Users/jlewallen/fieldkit/app/ios/build
	xcodebuild -exportArchive -archivePath /Users/jlewallen/fieldkit/app/ios/build/FieldKit.xcarchive -exportOptionsPlist exportOptions.plist -exportPath /Users/jlewallen/fieldkit/app/ios/build -allowProvisioningUpdates

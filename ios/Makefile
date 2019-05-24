#
#
#

build-developer: security-check
	xcodebuild -project FieldKit.xcodeproj -scheme FieldKit -sdk iphoneos -configuration Release archive -archivePath ${PWD}/build/FieldKit.xcarchive

build-adhoc: security-check
	xcodebuild -project FieldKit.xcodeproj -scheme FieldKit -sdk iphoneos -configuration Release archive -archivePath ${PWD}/build/FieldKit.xcarchive \
		PROVISIONING_PROFILE="dff15cae-922b-45df-889a-aa38c334599e" \
		CODE_SIGN_IDENTITY="iPhone Distribution" \
		PROVISIONING_PROFILE_SPECIFIER="Conservify Ad Hoc"

archive: security-check
	xcodebuild -configuration Release -exportOptionsPlist exportOptions.plist \
		-exportArchive -archivePath ${PWD}/build/FieldKit.xcarchive \
		-exportPath ${PWD}/build \
		-allowProvisioningUpdates

clean:
	xcodebuild -project FieldKit.xcodeproj -scheme FieldKit -sdk iphoneos -configuration Release clean

security-check:
	security show-keychain-info

.PHONY: build archive clean

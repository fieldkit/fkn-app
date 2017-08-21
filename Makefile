all: app/middleware/fieldkit-device.proto.json fake-device/fieldkit-device-proto/fieldkit-device.pb.go fake-device/fake-device

app/middleware/fieldkit-device.proto.json: fieldkit-device.proto
	node_modules/.bin/pbjs fieldkit-device.proto -t json -o app/middleware/fieldkit-device.proto.json

fake-device/fieldkit-device-proto/fieldkit-device.pb.go: fieldkit-device.proto
	~/tools/protobuf-3.3.0/src/protoc --go_out=fake-device/fieldkit-device-proto fieldkit-device.proto

fake-device/fake-device: fake-device/fake-device.go
	go build -o fake-device/fake-device fake-device/*.go

clean:
	rm -f fake-device/fake-device

// Code generated by protoc-gen-go. DO NOT EDIT.
// source: fieldkit-device.proto

/*
Package fieldkitdevice is a generated protocol buffer package.

It is generated from these files:
	fieldkit-device.proto

It has these top-level messages:
	PingRequest
	PingResponse
	RequestHeader
	ResponseHeader
*/
package fieldkitdevice

import proto "github.com/golang/protobuf/proto"
import fmt "fmt"
import math "math"

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.ProtoPackageIsVersion2 // please upgrade the proto package

type RequestHeader_MessageType int32

const (
	RequestHeader_PING      RequestHeader_MessageType = 0
	RequestHeader_SAY_HELLO RequestHeader_MessageType = 1
)

var RequestHeader_MessageType_name = map[int32]string{
	0: "PING",
	1: "SAY_HELLO",
}
var RequestHeader_MessageType_value = map[string]int32{
	"PING":      0,
	"SAY_HELLO": 1,
}

func (x RequestHeader_MessageType) String() string {
	return proto.EnumName(RequestHeader_MessageType_name, int32(x))
}
func (RequestHeader_MessageType) EnumDescriptor() ([]byte, []int) { return fileDescriptor0, []int{2, 0} }

type PingRequest struct {
	Time int64 `protobuf:"varint,1,opt,name=time" json:"time,omitempty"`
}

func (m *PingRequest) Reset()                    { *m = PingRequest{} }
func (m *PingRequest) String() string            { return proto.CompactTextString(m) }
func (*PingRequest) ProtoMessage()               {}
func (*PingRequest) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{0} }

func (m *PingRequest) GetTime() int64 {
	if m != nil {
		return m.Time
	}
	return 0
}

type PingResponse struct {
	Time int64 `protobuf:"varint,1,opt,name=time" json:"time,omitempty"`
}

func (m *PingResponse) Reset()                    { *m = PingResponse{} }
func (m *PingResponse) String() string            { return proto.CompactTextString(m) }
func (*PingResponse) ProtoMessage()               {}
func (*PingResponse) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{1} }

func (m *PingResponse) GetTime() int64 {
	if m != nil {
		return m.Time
	}
	return 0
}

type RequestHeader struct {
	Type RequestHeader_MessageType `protobuf:"varint,1,opt,name=type,enum=fieldkitdevice.RequestHeader_MessageType" json:"type,omitempty"`
}

func (m *RequestHeader) Reset()                    { *m = RequestHeader{} }
func (m *RequestHeader) String() string            { return proto.CompactTextString(m) }
func (*RequestHeader) ProtoMessage()               {}
func (*RequestHeader) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{2} }

func (m *RequestHeader) GetType() RequestHeader_MessageType {
	if m != nil {
		return m.Type
	}
	return RequestHeader_PING
}

type ResponseHeader struct {
	Success bool   `protobuf:"varint,1,opt,name=success" json:"success,omitempty"`
	Error   string `protobuf:"bytes,2,opt,name=error" json:"error,omitempty"`
}

func (m *ResponseHeader) Reset()                    { *m = ResponseHeader{} }
func (m *ResponseHeader) String() string            { return proto.CompactTextString(m) }
func (*ResponseHeader) ProtoMessage()               {}
func (*ResponseHeader) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{3} }

func (m *ResponseHeader) GetSuccess() bool {
	if m != nil {
		return m.Success
	}
	return false
}

func (m *ResponseHeader) GetError() string {
	if m != nil {
		return m.Error
	}
	return ""
}

func init() {
	proto.RegisterType((*PingRequest)(nil), "fieldkitdevice.PingRequest")
	proto.RegisterType((*PingResponse)(nil), "fieldkitdevice.PingResponse")
	proto.RegisterType((*RequestHeader)(nil), "fieldkitdevice.RequestHeader")
	proto.RegisterType((*ResponseHeader)(nil), "fieldkitdevice.ResponseHeader")
	proto.RegisterEnum("fieldkitdevice.RequestHeader_MessageType", RequestHeader_MessageType_name, RequestHeader_MessageType_value)
}

func init() { proto.RegisterFile("fieldkit-device.proto", fileDescriptor0) }

var fileDescriptor0 = []byte{
	// 252 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xe2, 0x12, 0x4d, 0xcb, 0x4c, 0xcd,
	0x49, 0xc9, 0xce, 0x2c, 0xd1, 0x4d, 0x49, 0x2d, 0xcb, 0x4c, 0x4e, 0xd5, 0x2b, 0x28, 0xca, 0x2f,
	0xc9, 0x17, 0xe2, 0x83, 0x09, 0x43, 0x44, 0x95, 0x14, 0xb9, 0xb8, 0x03, 0x32, 0xf3, 0xd2, 0x83,
	0x52, 0x0b, 0x4b, 0x53, 0x8b, 0x4b, 0x84, 0x84, 0xb8, 0x58, 0x4a, 0x32, 0x73, 0x53, 0x25, 0x18,
	0x15, 0x18, 0x35, 0x98, 0x83, 0xc0, 0x6c, 0x25, 0x25, 0x2e, 0x1e, 0x88, 0x92, 0xe2, 0x82, 0xfc,
	0xbc, 0xe2, 0x54, 0xac, 0x6a, 0xca, 0xb8, 0x78, 0xa1, 0x46, 0x78, 0xa4, 0x26, 0xa6, 0xa4, 0x16,
	0x09, 0xd9, 0x72, 0xb1, 0x94, 0x54, 0x16, 0x40, 0x14, 0xf1, 0x19, 0x69, 0xea, 0xa1, 0x5a, 0xab,
	0x87, 0xa2, 0x58, 0xcf, 0x37, 0xb5, 0xb8, 0x38, 0x31, 0x3d, 0x35, 0xa4, 0xb2, 0x20, 0x35, 0x08,
	0xac, 0x4d, 0x49, 0x8d, 0x8b, 0x1b, 0x49, 0x50, 0x88, 0x83, 0x8b, 0x25, 0xc0, 0xd3, 0xcf, 0x5d,
	0x80, 0x41, 0x88, 0x97, 0x8b, 0x33, 0xd8, 0x31, 0x32, 0xde, 0xc3, 0xd5, 0xc7, 0xc7, 0x5f, 0x80,
	0x51, 0xc9, 0x81, 0x8b, 0x0f, 0xe6, 0x2e, 0xa8, 0xc5, 0x12, 0x5c, 0xec, 0xc5, 0xa5, 0xc9, 0xc9,
	0xa9, 0xc5, 0xc5, 0x60, 0xbb, 0x39, 0x82, 0x60, 0x5c, 0x21, 0x11, 0x2e, 0xd6, 0xd4, 0xa2, 0xa2,
	0xfc, 0x22, 0x09, 0x26, 0x05, 0x46, 0x0d, 0xce, 0x20, 0x08, 0xc7, 0xc8, 0x8f, 0x8b, 0x3d, 0x38,
	0xb5, 0x08, 0xe4, 0x28, 0x21, 0x67, 0x2e, 0x16, 0x90, 0x47, 0x85, 0xa4, 0xd1, 0x5d, 0x8b, 0x14,
	0x42, 0x52, 0x32, 0xd8, 0x25, 0x21, 0x6e, 0x50, 0x62, 0x48, 0x62, 0x03, 0x87, 0xb3, 0x31, 0x20,
	0x00, 0x00, 0xff, 0xff, 0xac, 0xff, 0x8f, 0xba, 0x80, 0x01, 0x00, 0x00,
}

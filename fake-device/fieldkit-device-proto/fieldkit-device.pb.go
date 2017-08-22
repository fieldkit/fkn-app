// Code generated by protoc-gen-go. DO NOT EDIT.
// source: fieldkit-device.proto

/*
Package fieldkitdevice is a generated protocol buffer package.

It is generated from these files:
	fieldkit-device.proto

It has these top-level messages:
	PingRequest
	PingResponse
	HelloRequest
	HelloResponse
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
func (RequestHeader_MessageType) EnumDescriptor() ([]byte, []int) { return fileDescriptor0, []int{4, 0} }

type PingRequest struct {
}

func (m *PingRequest) Reset()                    { *m = PingRequest{} }
func (m *PingRequest) String() string            { return proto.CompactTextString(m) }
func (*PingRequest) ProtoMessage()               {}
func (*PingRequest) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{0} }

type PingResponse struct {
}

func (m *PingResponse) Reset()                    { *m = PingResponse{} }
func (m *PingResponse) String() string            { return proto.CompactTextString(m) }
func (*PingResponse) ProtoMessage()               {}
func (*PingResponse) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{1} }

type HelloRequest struct {
	Name string `protobuf:"bytes,1,opt,name=name" json:"name,omitempty"`
}

func (m *HelloRequest) Reset()                    { *m = HelloRequest{} }
func (m *HelloRequest) String() string            { return proto.CompactTextString(m) }
func (*HelloRequest) ProtoMessage()               {}
func (*HelloRequest) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{2} }

func (m *HelloRequest) GetName() string {
	if m != nil {
		return m.Name
	}
	return ""
}

type HelloResponse struct {
	Message string `protobuf:"bytes,1,opt,name=message" json:"message,omitempty"`
}

func (m *HelloResponse) Reset()                    { *m = HelloResponse{} }
func (m *HelloResponse) String() string            { return proto.CompactTextString(m) }
func (*HelloResponse) ProtoMessage()               {}
func (*HelloResponse) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{3} }

func (m *HelloResponse) GetMessage() string {
	if m != nil {
		return m.Message
	}
	return ""
}

type RequestHeader struct {
	Type RequestHeader_MessageType `protobuf:"varint,1,opt,name=type,enum=fieldkitdevice.RequestHeader_MessageType" json:"type,omitempty"`
}

func (m *RequestHeader) Reset()                    { *m = RequestHeader{} }
func (m *RequestHeader) String() string            { return proto.CompactTextString(m) }
func (*RequestHeader) ProtoMessage()               {}
func (*RequestHeader) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{4} }

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
func (*ResponseHeader) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{5} }

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
	proto.RegisterType((*HelloRequest)(nil), "fieldkitdevice.HelloRequest")
	proto.RegisterType((*HelloResponse)(nil), "fieldkitdevice.HelloResponse")
	proto.RegisterType((*RequestHeader)(nil), "fieldkitdevice.RequestHeader")
	proto.RegisterType((*ResponseHeader)(nil), "fieldkitdevice.ResponseHeader")
	proto.RegisterEnum("fieldkitdevice.RequestHeader_MessageType", RequestHeader_MessageType_name, RequestHeader_MessageType_value)
}

func init() { proto.RegisterFile("fieldkit-device.proto", fileDescriptor0) }

var fileDescriptor0 = []byte{
	// 293 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x74, 0x51, 0x4f, 0x4b, 0xfb, 0x40,
	0x10, 0x6d, 0x7e, 0xe4, 0x67, 0xd2, 0x69, 0x13, 0xca, 0xa0, 0x10, 0xaa, 0x82, 0xec, 0x41, 0xec,
	0xc1, 0x1c, 0xea, 0x59, 0x50, 0x44, 0x4c, 0xa1, 0x6a, 0x49, 0xbc, 0x78, 0x92, 0x98, 0x8c, 0x25,
	0x98, 0x26, 0x71, 0x37, 0x2d, 0xe4, 0xa3, 0xf8, 0x6d, 0xa5, 0xbb, 0x59, 0x48, 0xfd, 0x73, 0xdb,
	0x37, 0xef, 0xcd, 0x9b, 0xc7, 0x5b, 0x38, 0x78, 0xcb, 0x28, 0x4f, 0xdf, 0xb3, 0xfa, 0x3c, 0xa5,
	0x4d, 0x96, 0x90, 0x5f, 0xf1, 0xb2, 0x2e, 0xd1, 0xd5, 0x63, 0x35, 0x65, 0x0e, 0x0c, 0x16, 0x59,
	0xb1, 0x0c, 0xe9, 0x63, 0x4d, 0xa2, 0x66, 0x2e, 0x0c, 0x15, 0x14, 0x55, 0x59, 0x08, 0x62, 0x0c,
	0x86, 0x01, 0xe5, 0x79, 0xd9, 0xf2, 0x88, 0x60, 0x16, 0xf1, 0x8a, 0x3c, 0xe3, 0xc4, 0x38, 0xeb,
	0x87, 0xf2, 0xcd, 0x26, 0xe0, 0xb4, 0x1a, 0xb5, 0x84, 0x1e, 0x58, 0x2b, 0x12, 0x22, 0x5e, 0x6a,
	0x9d, 0x86, 0x6c, 0x03, 0x4e, 0xeb, 0x14, 0x50, 0x9c, 0x12, 0xc7, 0x4b, 0x30, 0xeb, 0xa6, 0x52,
	0x3a, 0x77, 0x3a, 0xf1, 0x77, 0xd3, 0xf9, 0x3b, 0x62, 0xff, 0x5e, 0xb9, 0x3c, 0x35, 0x15, 0x85,
	0x72, 0x8d, 0x9d, 0xc2, 0xa0, 0x33, 0x44, 0x1b, 0xcc, 0xc5, 0xec, 0xe1, 0x6e, 0xd4, 0x43, 0x07,
	0xfa, 0xd1, 0xf5, 0xf3, 0x4b, 0x70, 0x3b, 0x9f, 0x3f, 0x8e, 0x0c, 0x76, 0x05, 0xae, 0x4e, 0xd7,
	0x1e, 0xf6, 0xc0, 0x12, 0xeb, 0x24, 0x21, 0x21, 0xe4, 0x6d, 0x3b, 0xd4, 0x10, 0xf7, 0xe1, 0x3f,
	0x71, 0x5e, 0x72, 0xef, 0x9f, 0xcc, 0xae, 0xc0, 0xf4, 0xd3, 0x00, 0x2b, 0x22, 0xbe, 0x4d, 0x85,
	0x37, 0x60, 0x6e, 0x4b, 0xc2, 0xc3, 0xef, 0x71, 0x3b, 0x4d, 0x8e, 0x8f, 0x7e, 0x27, 0xdb, 0x5e,
	0x7b, 0x38, 0x03, 0x3b, 0x8a, 0x1b, 0x59, 0x1c, 0xfe, 0xd0, 0x76, 0x3b, 0x1f, 0x1f, 0xff, 0xc1,
	0x6a, 0xab, 0xd7, 0x3d, 0xf9, 0xb5, 0x17, 0x5f, 0x01, 0x00, 0x00, 0xff, 0xff, 0xec, 0x8c, 0x9b,
	0x23, 0xf3, 0x01, 0x00, 0x00,
}

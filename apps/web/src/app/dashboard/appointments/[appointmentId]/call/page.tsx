// In apps/web/src/app/dashboard/appointments/[appointmentId]/call/page.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

// STUN servers help browsers find each other behind firewalls. We can use Google's public ones.
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export default function CallPage() {
  const params = useParams();
  const appointmentId = params.appointmentId as string;

  // Refs to hold mutable objects without causing re-renders
  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Refs for the video elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  const [status, setStatus] = useState('Connecting...');

  // This is the main effect for setting up and tearing down the call
  useEffect(() => {
    // 1. Initialize Socket.IO connection
    socketRef.current = io('http://localhost:3001'); // Your backend URL
    const socket = socketRef.current;

    // 2. Get user's camera and microphone
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // 3. Join the room for this specific appointment
        socket.emit('join-room', { room: appointmentId });
        setStatus('Waiting for other user to join...');
      })
      .catch(error => {
        console.error("Error accessing media devices.", error);
        setStatus('Failed to access camera/microphone.');
      });

    // 4. Set up listeners for signaling events from the server
    socket.on('user-joined', () => {
      setStatus('Other user joined. Creating connection...');
      createOffer();
    });

    socket.on('signal', async (data) => {
      if (data.payload.offer) {
        setStatus('Received offer. Creating answer...');
        createAnswer(data.payload.offer);
      } else if (data.payload.answer) {
        setStatus('Received answer. Connecting...');
        await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(data.payload.answer));
      } else if (data.payload.candidate) {
        await peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(data.payload.candidate));
      }
    });
    
    // The cleanup function is critical for stopping connections and streams
    return () => {
      socket.disconnect();
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [appointmentId]);

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    // Add local stream tracks to the connection so they can be sent to the other peer
    localStreamRef.current?.getTracks().forEach(track => {
      pc.addTrack(track, localStreamRef.current!);
    });

    // When the remote peer adds their stream, display it
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setStatus('Connected!');
      }
    };

    // When an ICE candidate is generated, send it to the other peer via the signaling server
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit('signal', { room: appointmentId, payload: { candidate: event.candidate } });
      }
    };
    
    peerConnectionRef.current = pc;
    return pc;
  };

  const createOffer = async () => {
    const pc = createPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socketRef.current?.emit('signal', { room: appointmentId, payload: { offer } });
  };

  const createAnswer = async (offer: RTCSessionDescriptionInit) => {
    const pc = createPeerConnection();
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socketRef.current?.emit('signal', { room: appointmentId, payload: { answer } });
  };


  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Video Consultation</h1>
      <p className="mt-2 text-gray-600">Status: {status}</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-black rounded-lg overflow-hidden shadow-lg">
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-50 rounded text-white text-sm">
            You
          </div>
        </div>
        <div className="bg-black rounded-lg overflow-hidden shadow-lg">
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-50 rounded text-white text-sm">
            Remote User
          </div>
        </div>
      </div>
      {/* TODO: Add controls for mute, end call, etc. */}
    </div>
  );
}
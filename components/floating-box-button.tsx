"use client";

import Image from "next/image";

export default function FloatingBoxButton() {
  return (
    <a
      href="https://twocentsclub.substack.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Visit our Substack newsletter"
    >
      <Image
        src="/images/2C-Landing-Assets/box-top.svg"
        alt="Two Cents Club Substack"
        width={150}
        height={150}
        className="group-hover:animate-jitter cursor-pointer"
        priority={false}
      />
    </a>
  );
}

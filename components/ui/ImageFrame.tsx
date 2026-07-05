import Image from 'next/image'

export function ImageFrame(props: { src: string; alt: string; priority?: boolean }) {
  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] bg-white">
      <Image src={props.src} alt={props.alt} fill priority={props.priority} className="object-cover" sizes="100vw" />
    </div>
  )
}

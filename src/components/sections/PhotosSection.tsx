'use client';

const historicalPhotos = [
    {
        src: "/image/apple.png",
        alt: "Apple 창립자들"
    },
    {
        src: "/image/tesla.png",
        alt: "Tesla 초기"
    },
    {
        src: "/image/amazon.png",
        alt: "Amazon 초기"
    },
    {
        src: "/image/meta.png",
        alt: "Facebook(Meta) 초기"
    }
];

export function PhotosSection() {
    return (
        <section className="min-h-screen bg-gray-900 flex items-center justify-center relative px-8">
            {/* 어두운 오버레이 */}
            <div className="absolute inset-0 bg-black bg-opacity-60" />



            {/* 우측 상단 부제목 */}
            <div className="absolute top-8 right-8 z-10 text-right">
                <h3 className="font-crayons text-white text-lg md:text-xl">
                    TWO KOREAN COLLEGE STUDENTS ON A JOURNEY TO BUILD A{' '}
                    <span className="text-primary-500">UNICORN</span>{' '}
                    <span className="text-lg">🦄</span>
                </h3>
            </div>

            {/* 4개 사진 그리드 */}
            <div className="max-w-6xl mx-auto grid grid-cols-2 gap-6 lg:gap-8 relative z-10">
                {historicalPhotos.map((photo, index) => (
                    <div key={index} className="aspect-video bg-white rounded-lg overflow-hidden shadow-lg">
                        <img
                            src={photo.src}
                            alt={photo.alt}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}

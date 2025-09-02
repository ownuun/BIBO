'use client';

const quotes = [
    {
        text: "Being the richest man in the cemetery doesn't matter to me. Going to bed at night saying we've done something wonderful... that's what matters to me.",
        author: "Steve Jobs"
    },
    {
        text: "I'd rather be optimistic and wrong than pessimistic and right.",
        author: "Elon Musk"
    },
    {
        text: "The biggest risk is not taking any risk.",
        author: "Mark Zuckerberg"
    },
    {
        text: "If you can't tolerate critics, don't do anything new or interesting.",
        author: "Jeff Bezos"
    }
];

export function QuotesSection() {
    return (
        <section className="min-h-screen bg-secondary-500 flex items-center justify-center relative px-8">
            {/* 좌측 상단 BIBO 로고 (작게) */}
            <div className="absolute top-8 left-8 z-10">
                <img
                    src="/image/logo.png"
                    alt="BIBO Logo"
                    className="w-16 h-16 object-contain"
                />
            </div>

            {/* 좌측 상단 언어/지역 아이콘 */}
            <div className="absolute top-8 right-8 z-10">
                <div className="w-8 h-8 rounded-full bg-black bg-opacity-20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full border border-black opacity-60" />
                </div>
                <span className="text-xs text-black opacity-60 mt-1 block text-center">EN/KO</span>
            </div>

            {/* 4개 명언 그리드 */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {quotes.map((quote, index) => (
                    <div key={index} className="space-y-4">
                        <blockquote className="font-body text-black text-lg md:text-xl leading-relaxed">
                            "{quote.text}"
                        </blockquote>
                    </div>
                ))}
            </div>
        </section>
    );
}

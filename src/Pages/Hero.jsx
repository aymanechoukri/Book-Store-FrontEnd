import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Hero() {
    return (
        <div className="relative overflow-hidden bg-[#F9FAFB]">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 to-transparent"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#2563EB]/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#10B98]/5 rounded-full blur-3xl"></div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Left Column - Content */}
                    <div className="space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center px-4 py-2 bg-[#10B98]/10 rounded-full">
                            <i className="fas fa-star text-[#10B98] text-sm mr-2"></i>
                            <span className="text-sm font-medium text-[#10B98]">New Arrivals Weekly</span>
                        </div>
                        
                        {/* Main Heading */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111827] leading-tight">
                            Discover Your Next
                            <span className="text-[#2563EB]"> Great Read</span>
                        </h1>
                        
                        {/* Description */}
                        <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                            Explore thousands of books across all genres. From bestsellers to hidden gems, 
                            find the perfect book that speaks to you.
                        </p>
                        
                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="px-8 py-3 bg-[#1D4ED8] text-white font-semibold rounded-lg 
                                           hover:bg-[#2563EB] transition-all duration-300 transform hover:scale-105 
                                           shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                                <i className="fas fa-shopping-cart"></i>
                                Shop Now
                            </button>
                            <button className="px-8 py-3 bg-transparent border-2 border-[#2563EB] text-[#2563EB] 
                                           font-semibold rounded-lg hover:bg-[#2563EB] hover:text-white 
                                           transition-all duration-300 flex items-center justify-center gap-2">
                                <i className="fas fa-book-open"></i>
                                Browse Categories
                            </button>
                        </div>
                        
                        {/* Stats */}
                        <div className="flex gap-8 pt-6">
                            <div>
                                <p className="text-2xl font-bold text-[#111827]">10,000+</p>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <i className="fas fa-book text-[#2563EB] text-xs"></i>
                                    Books Available
                                </p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[#111827]">500+</p>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <i className="fas fa-users text-[#2563EB] text-xs"></i>
                                    Happy Readers
                                </p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[#111827]">4.9⭐</p>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <i className="fas fa-star text-[#10B98] text-xs"></i>
                                    Customer Rating
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Column - Image/Illustration */}
                    <div className="relative">
                        <div className="relative z-10">
                            {/* Book Stack Illustration */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2 space-y-4">
                                    <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                                        <div className="w-12 h-16 bg-[#2563EB] rounded mb-2 flex items-center justify-center">
                                            <i className="fas fa-book-open text-white text-xl"></i>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded w-3/4 mb-1"></div>
                                        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                                        <div className="w-12 h-16 bg-[#10B98] rounded mb-2 flex items-center justify-center">
                                            <i className="fas fa-book text-white text-xl"></i>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded w-3/4 mb-1"></div>
                                        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                                        <div className="w-12 h-16 bg-[#2563EB]/70 rounded mb-2 flex items-center justify-center">
                                            <i className="fas fa-book-reader text-white text-xl"></i>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded w-3/4 mb-1"></div>
                                        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                                        <div className="w-12 h-16 bg-[#10B98]/70 rounded mb-2 flex items-center justify-center">
                                            <i className="fas fa-graduation-cap text-white text-xl"></i>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded w-3/4 mb-1"></div>
                                        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Floating elements */}
                            <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg animate-bounce">
                                <i className="fas fa-bookmark text-[#2563EB] text-2xl"></i>
                            </div>
                            <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg animate-pulse">
                                <i className="fas fa-crown text-[#10B98] text-2xl"></i>
                            </div>
                        </div>
                        
                        {/* Background decoration */}
                        <div className="absolute inset-0 bg-linear-to-tr from-[#2563EB]/10 to-[#10B98]/10 rounded-3xl blur-2xl"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
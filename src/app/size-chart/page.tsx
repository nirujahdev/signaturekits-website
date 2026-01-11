import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';

export default function SizeChartPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-[100px] md:pt-[140px] pb-[80px]">
        <div className="container mx-auto px-4 md:px-6 lg:px-[60px] max-w-7xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-black leading-tight mb-12 md:mb-16">
            Size Chart
          </h1>

          <div className="prose max-w-none">
            <p className="text-base md:text-lg text-[#666666] leading-relaxed mb-8">
              Find the perfect fit for your jersey. Please refer to the measurements below to ensure you select the correct size.
            </p>

            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-black mb-6">Adult Sizes</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-[#E5E5E5]">
                  <thead>
                    <tr className="bg-[#FAFAFA]">
                      <th className="border border-[#E5E5E5] px-4 py-3 text-left font-semibold text-black">Size</th>
                      <th className="border border-[#E5E5E5] px-4 py-3 text-left font-semibold text-black">Chest (cm)</th>
                      <th className="border border-[#E5E5E5] px-4 py-3 text-left font-semibold text-black">Length (cm)</th>
                      <th className="border border-[#E5E5E5] px-4 py-3 text-left font-semibold text-black">Shoulder (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">S</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">48-50</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">70</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">44</td>
                    </tr>
                    <tr className="bg-[#FAFAFA]">
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">M</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">52-54</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">72</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">46</td>
                    </tr>
                    <tr>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">L</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">56-58</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">74</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">48</td>
                    </tr>
                    <tr className="bg-[#FAFAFA]">
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">XL</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">60-62</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">76</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">50</td>
                    </tr>
                    <tr>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">XXL</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">64-66</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">78</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">52</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-black mb-6">Kids Sizes</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-[#E5E5E5]">
                  <thead>
                    <tr className="bg-[#FAFAFA]">
                      <th className="border border-[#E5E5E5] px-4 py-3 text-left font-semibold text-black">Size</th>
                      <th className="border border-[#E5E5E5] px-4 py-3 text-left font-semibold text-black">Chest (cm)</th>
                      <th className="border border-[#E5E5E5] px-4 py-3 text-left font-semibold text-black">Length (cm)</th>
                      <th className="border border-[#E5E5E5] px-4 py-3 text-left font-semibold text-black">Age Guide</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">XS</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">32-34</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">50</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">4-6 years</td>
                    </tr>
                    <tr className="bg-[#FAFAFA]">
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">S</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">36-38</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">54</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">7-9 years</td>
                    </tr>
                    <tr>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">M</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">40-42</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">58</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">10-12 years</td>
                    </tr>
                    <tr className="bg-[#FAFAFA]">
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">L</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">44-46</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">62</td>
                      <td className="border border-[#E5E5E5] px-4 py-3 text-[#666666]">13-15 years</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-semibold text-black mb-4">How to Measure</h2>
              <ul className="space-y-3 text-[#666666]">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape measure horizontal.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Length:</strong> Measure from the top of the shoulder down to the bottom hem of the jersey.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Shoulder:</strong> Measure from shoulder seam to shoulder seam across the back.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


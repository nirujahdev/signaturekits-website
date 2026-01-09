import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-6 py-12 max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-semibold mb-8">Jersey Size Chart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Visual Measurement Guide */}
          <div className="bg-gradient-to-br from-teal-900 to-teal-700 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-semibold mb-6">How to Measure</h2>
            
            {/* T-shirt illustration placeholder */}
            <div className="bg-white/10 rounded-lg p-8 mb-6 flex items-center justify-center">
              <div className="relative w-48 h-64 bg-white/20 rounded-lg flex flex-col items-center justify-center">
                {/* T-shirt shape */}
                <div className="absolute inset-4 border-2 border-white/50 rounded-t-lg" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 100%, 0% 100%, 0% 20%)' }} />
                
                {/* Chest measurement arrow */}
                <div className="absolute top-1/3 left-0 right-0 flex items-center">
                  <div className="flex-1 border-t-2 border-white/70" />
                  <div className="px-2 text-xs font-semibold">CHEST</div>
                  <div className="flex-1 border-t-2 border-white/70" />
                </div>
                
                {/* Length measurement arrow */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center justify-center">
                  <div className="flex-1 border-l-2 border-white/70" />
                  <div className="px-2 text-xs font-semibold writing-vertical">LENGTH</div>
                  <div className="flex-1 border-l-2 border-white/70" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4 text-sm">
              <div>
                <strong className="block mb-1">CHEST:</strong>
                <p className="text-white/90">Measure around the fullest part of your chest, keeping the tape measure horizontal.</p>
              </div>
              <div>
                <strong className="block mb-1">LENGTH:</strong>
                <p className="text-white/90">Measure from the top of the shoulder down to the bottom hem.</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-sm font-medium">Sublimation & Embroidery</p>
            </div>
          </div>

          {/* Size Chart Table */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-black">Size Chart</h2>
            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">SIZE</TableHead>
                    <TableHead className="font-semibold">LENGTH (inches)</TableHead>
                    <TableHead className="font-semibold">CHEST (inches)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">S</TableCell>
                    <TableCell>26</TableCell>
                    <TableCell>36</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">M</TableCell>
                    <TableCell>27</TableCell>
                    <TableCell>38</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">L</TableCell>
                    <TableCell>28</TableCell>
                    <TableCell>40</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">XL</TableCell>
                    <TableCell>29</TableCell>
                    <TableCell>42</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">2XL</TableCell>
                    <TableCell>30</TableCell>
                    <TableCell>44</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">3XL</TableCell>
                    <TableCell>30</TableCell>
                    <TableCell>46</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Fit Notes */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold mb-3 text-lg">Fit Notes</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Jerseys have a regular fit - not too tight, not too loose</li>
            <li>• If you prefer a looser fit, consider sizing up</li>
            <li>• For a more fitted look, choose your exact size</li>
            <li>• All measurements are in inches and are approximate</li>
            <li>• Available in Sublimation & Embroidery options</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}


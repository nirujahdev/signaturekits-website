import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-semibold mb-8">Size Guide</h1>

        <div className="prose max-w-none mb-12">
          <p className="text-lg text-gray-600 mb-8">
            Find the perfect fit for your jersey. All measurements are in centimeters.
            If you're between sizes, we recommend sizing up for a more comfortable fit.
          </p>
        </div>

        {/* Adult Sizes */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Adult Sizes</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Size</TableHead>
                  <TableHead>Chest (cm)</TableHead>
                  <TableHead>Length (cm)</TableHead>
                  <TableHead>Sleeve (cm)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold">Small (S)</TableCell>
                  <TableCell>96-100</TableCell>
                  <TableCell>70</TableCell>
                  <TableCell>22</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Medium (M)</TableCell>
                  <TableCell>100-104</TableCell>
                  <TableCell>72</TableCell>
                  <TableCell>23</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Large (L)</TableCell>
                  <TableCell>104-108</TableCell>
                  <TableCell>74</TableCell>
                  <TableCell>24</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Extra Large (XL)</TableCell>
                  <TableCell>108-112</TableCell>
                  <TableCell>76</TableCell>
                  <TableCell>25</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">2XL</TableCell>
                  <TableCell>112-116</TableCell>
                  <TableCell>78</TableCell>
                  <TableCell>26</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Kids Sizes */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Kids Sizes</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Size</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Chest (cm)</TableHead>
                  <TableHead>Length (cm)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold">XS (4-5 years)</TableCell>
                  <TableCell>4-5</TableCell>
                  <TableCell>60-64</TableCell>
                  <TableCell>50</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">S (6-7 years)</TableCell>
                  <TableCell>6-7</TableCell>
                  <TableCell>64-68</TableCell>
                  <TableCell>54</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">M (8-9 years)</TableCell>
                  <TableCell>8-9</TableCell>
                  <TableCell>68-72</TableCell>
                  <TableCell>58</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">L (10-11 years)</TableCell>
                  <TableCell>10-11</TableCell>
                  <TableCell>72-76</TableCell>
                  <TableCell>62</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">XL (12-13 years)</TableCell>
                  <TableCell>12-13</TableCell>
                  <TableCell>76-80</TableCell>
                  <TableCell>66</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* How to Measure */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">How to Measure</h2>
          <ul className="space-y-2 text-gray-700">
            <li>
              <strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape measure horizontal.
            </li>
            <li>
              <strong>Length:</strong> Measure from the top of the shoulder down to the desired length.
            </li>
            <li>
              <strong>Sleeve:</strong> Measure from the center back of the neck, over the shoulder, and down to the wrist.
            </li>
          </ul>
        </div>

        {/* Fit Notes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold mb-2">Fit Notes</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Jerseys have a regular fit - not too tight, not too loose</li>
            <li>• If you prefer a looser fit, consider sizing up</li>
            <li>• For a more fitted look, choose your exact size</li>
            <li>• All measurements are approximate and may vary by manufacturer</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}


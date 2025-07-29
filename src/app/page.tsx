import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-black">
      {/* Hero Section */}
      <div
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage:
            'url("https://weaverlabs.io/wp-content/uploads/2024/11/c779bbf73ff6689e104ab79f1291eeb7-1.webp")',
          backgroundPosition: '50% 47%',
          backgroundSize: 'cover',
          backgroundAttachment: 'scroll',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-8">
              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Orchestrate <span className="text-gray-300">Your Dishes</span>
                <br />
                Enhance <span className="text-gray-300">Your Cooking</span>
                <br />
                With Weaver Plate
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                A smart recipe management platform that helps home cooks and
                chefs organize, discover, and perfect their culinary creations,
                turning every meal into a masterpiece with precision and ease.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-3 bg-white/10 border-white/20 
                  text-white hover:bg-white border-lg rounded-3xl"
                  asChild
                >
                  <Link href="/recipes">Check Recipes</Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-3 bg-white/10 border-white/20 
                  text-white hover:bg-white border-lg rounded-3xl"
                  asChild
                >
                  <Link href="/ingredients">Manage Ingredients</Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-3 bg-white/10 border-white/20 
                  text-white hover:bg-white border-lg rounded-3xl"
                  asChild
                >
                  <Link href="/new-recipe">Create New Recipe</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

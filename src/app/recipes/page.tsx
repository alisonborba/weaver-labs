'use client';

import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Recipe } from '@/types';
import { useDeleteRecipe, useGetRecipes } from '@/hooks/use-mutations';
import { Header } from '@/components/Header';
import { ingredientList } from '@/lib/utils';
import { TableRowSkeleton } from '@/components/TableRowSkeleton';

export default function RecipeTable() {
  const { data, isLoading } = useGetRecipes();

  const deleteRecipeMutation = useDeleteRecipe();

  return (
    <div className="container mx-auto">
      <Header
        title="Recipes List"
        rightContent={
          <Button asChild>
            <Link href="/new-recipe">Add Recipe</Link>
          </Button>
        }
      />
      <div className="mx-4 my-5 border rounded ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Ingredients</TableHead>
              <TableHead className="text-right pr-4">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRowSkeleton columns={3} />}
            {data?.recipes.map((recipe: Recipe) => (
              <TableRow key={recipe.id}>
                <TableCell>{recipe.name}</TableCell>
                <TableCell>
                  {ingredientList(recipe.ingredients, data)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteRecipeMutation.mutate(recipe.id)}
                    disabled={deleteRecipeMutation.isPending}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {data?.recipes.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  No recipes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {data?.recipes && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>
                  Total Recipes: {data?.recipes.length}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
    </div>
  );
}

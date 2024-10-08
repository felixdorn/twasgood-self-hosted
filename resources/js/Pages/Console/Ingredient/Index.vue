<script lang="ts" setup>
import Connected from "@/Layouts/Connected.vue";
import type {Ingredient} from "@/types";
import {DocumentMagnifyingGlassIcon, DocumentPlusIcon} from "@heroicons/vue/24/outline";
import Button from "@/Components/Button.vue";
import {Link} from "@inertiajs/vue3";
import Tab from "@/Components/Tab.vue";
import EmptyState from "@/Components/EmptyState.vue";

enum IngredientType {
    Vegan = 'vegan',
    Vegetarian = 'vegetarian',
    Meat = 'meat',
    Other = 'other',
}

const props = defineProps<{
    ingredients: Ingredient[],
    active_tab: IngredientType
}>()

const tabs = [IngredientType.Vegan, IngredientType.Vegetarian, IngredientType.Meat, IngredientType.Other,].map((type) => ({
    name: {
        [IngredientType.Vegan]: 'Végétal',
        [IngredientType.Vegetarian]: 'Végétarien',
        [IngredientType.Meat]: 'Carné',
        [IngredientType.Other]: 'Autres',
    }[type],
    href: route('console.ingredients.index', {active: type}),
    current: props.active_tab === type
}))
</script>
<template>
    <Connected title="Ingrédients">
        <template #header>
            <Button :href="route('console.ingredients.create')" :icon="DocumentPlusIcon">Nouvel ingrédient</Button>
        </template>

        <Tab :tabs="tabs"/>
        <masonry-wall v-if="ingredients.length > 0" :gap="16" :items="ingredients" class="mt-2">
            <template #default="{ item }">
                <Link
                    :href="route('console.ingredients.edit', { ingredient: item.id, })"
                    class="group block border rounded-xl bg-white py-4 px-6"
                >
                    <h3 class="md:flex items-center justify-between">
                        <span class="text-lg group-hover:underline">{{ item.name }}</span>
                        <span class="block md:inline text-gray-500">
                    </span>
                    </h3>
                    <h4 class="text-gray-500">{{
                            {
                                vegetarian: 'Végétarien',
                                vegan: 'Végétal',
                                meat: 'Carné'
                            }[item.type]
                        }}</h4>

                    <ul v-if="item.contains_gluten || item.contains_dairy" class="flex space-x-2 mt-1.5">
                        <li v-if="item.contains_gluten">
                           <span
                               class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                               Gluten
                           </span>
                        </li>
                        <li v-if="item.contains_dairy">
                            <span
                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                                Lactose
                            </span>
                        </li>
                    </ul>
                </Link>
            </template>
        </masonry-wall>
        <EmptyState
            v-else
            :action-href="route('console.ingredients.create')"
            :action-icon="DocumentPlusIcon"
            :icon="DocumentMagnifyingGlassIcon"
            action-title="Nouvel ingrédient"
            class="text-center mt-6"
            description="Vos ingrédients s'afficheront ici, une fois créés."
            title="Aucun ingrédient"
        />
    </Connected>
</template>

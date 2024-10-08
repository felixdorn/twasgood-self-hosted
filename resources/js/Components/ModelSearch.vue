<script setup lang="ts">
import {computed, ref} from "vue";
import {Combobox, ComboboxButton, ComboboxInput, ComboboxLabel, ComboboxOption, ComboboxOptions,} from '@headlessui/vue'
import {CheckIcon, ChevronUpDownIcon} from "@heroicons/vue/24/outline";

const props = defineProps<{
    label: string,
    models: {
        id: string|number,
        [key: string]: any
    }[],
    hideLabel?: boolean
    searchProperty: string,
    first?: boolean
}>()

const query = ref('')
const filtered = computed<object[]>(() =>
    query.value === ''
        ? props.models
        : props.models.filter((model: object) => model[props.searchProperty].toLowerCase().includes(query.value.toLowerCase()))
)

const emit = defineEmits<{
    (event: 'change', value: string|number|null): void
}>()

const selectedValue = ref<string|number|null>(null)
const selected = computed({
    get: () => selectedValue.value,
    set: (v: string|number|null) => {
        selectedValue.value = v

        emit('change', v)
    }

})
</script>
<template>
    <Combobox v-model="selected" as="div" :class="[first ? '' : 'mt-4']">
        <ComboboxLabel v-if="!hideLabel" class="block font-medium text-gray-700">{{  label }}</ComboboxLabel>
        <div class="relative" :class="hideLabel ? '' : 'mt-1'">
            <ComboboxInput :display-value="(model) => model?.[searchProperty]"
                           class="w-full rounded-xl border border-gray-200 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:text-sm"
                           v-bind="$attrs"

                           @change="query = $event.target.value"/>
            <ComboboxButton
                class="absolute inset-y-0 right-0 flex items-center rounded-r-xl px-2 focus:outline-none">
                <ChevronUpDownIcon aria-hidden="true" class="h-5 w-5 text-gray-400"/>
            </ComboboxButton>

            <ComboboxOptions v-if="filtered.length > 0"
                             class="absolute z-[1000] mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <ComboboxOption v-for="model in filtered" :key="model.id"
                                v-slot="{ active, selected }" :value="model" as="template">
                    <li :class="['relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-brand-600 text-white' : 'text-gray-900']">
            <span :class="['block truncate', selected && 'fon²t-semibold']">
              {{ model[searchProperty] }}
            </span>

                        <span v-if="selected"
                              :class="['absolute inset-y-0 right-0 flex items-center pr-4', active ? 'text-white' : 'text-brand-600']">
              <CheckIcon aria-hidden="true" class="h-5 w-5"/>
            </span>
                    </li>
                </ComboboxOption>
            </ComboboxOptions>
        </div>
    </Combobox>

</template>

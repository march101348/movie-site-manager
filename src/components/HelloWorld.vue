<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";

const siteList = ref<string[]>([]);
const newSite = ref("");

onMounted(async () => {
  const ret = await chrome.runtime.sendMessage({ type: "getSiteList" });
  console.log("siteList", ret);
  siteList.value = ret;
});

async function add() {
  console.log("siteList", siteList.value);
  console.log("add", newSite.value);
  siteList.value = await chrome.runtime.sendMessage({
    type: "addSite",
    site: newSite.value,
  });
  newSite.value = "";
}

async function remove(site: string) {
  siteList.value = await chrome.runtime.sendMessage({
    type: "removeSite",
    site: site,
  });
}
</script>

<template>
  <div class="min-w-80 p-2">
    <div class="flex gap-2 items-center py-4">
      <Input type="text" placeholder="https://example.com/*" v-model="newSite" />
      <Button class="add-btn" @click="add">Add</Button>
    </div>
    <Table>
      <TableBody>
        <TableRow v-for="site in siteList" :key="site">
          <TableCell>
            {{ site }}
          </TableCell>
          <TableCell>
            <Button
              class="remove-btn"
              size="sm"
              variant="destructive"
              @click="remove(site)"
              >Remove</Button
            >
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

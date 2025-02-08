<template>
  <div class="dropdown">
    <div tabindex="0" role="button" class="btn m-1 btn-color1">
      Theme
      <svg width="12px" height="12px" class="inline-block h-2 w-2 fill-current opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
        <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
      </svg>
    </div>
    <ul tabindex="0" class="dropdown-content bg-base-300 rounded-box z-[1] p-2 shadow-2xl">
      <li>
        <input
          type="radio"
          name="theme-dropdown"
          class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
          aria-label="default"
          value="light"
          @change="handleThemeChange"
        />
      </li>
      <li>
        <input
          type="radio"
          name="theme-dropdown"
          class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
          aria-label="dark"
          value="dark"
          @change="handleThemeChange"
        />
      </li>
      <li>
        <input
          type="radio"
          name="theme-dropdown"
          class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
          aria-label="cupcake"
          value="cupcake"
          @change="handleThemeChange"
        />
      </li>
      <li>
        <input
          type="radio"
          name="theme-dropdown"
          class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
          aria-label="acid"
          value="acid"
          @change="handleThemeChange"
        />
      </li>
      <li>
        <input
          type="radio"
          name="theme-dropdown"
          class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
          aria-label="lemonade"
          value="lemonade"
          @change="handleThemeChange"
        />
      </li>
    </ul>
  </div>
</template>

<script setup>
/**
 * 当用户更改主题选择时，获取单选按钮的 value，
 * 然后将该值设置到 <html> 标签的 data-theme 属性上，
 * DaisyUI 会自动根据这个属性应用对应的主题样式。
 */
const handleThemeChange = (event) => {
  const theme = event.target.value;
  document.documentElement.setAttribute("data-theme", theme);
};
</script>

<style lang="scss" scoped>
li {
  width: 120px;
}
.btn-color1 {
  background-color: oklch(var(--b1));
  box-shadow: initial;
  border-color: transparent;

  &:hover {
    background-color: oklch(var(--b2));
  }
}
</style>

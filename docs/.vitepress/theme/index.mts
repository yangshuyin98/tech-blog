import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import PostList from './components/PostList.vue'

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('PostList', PostList)
  },
}

export default theme

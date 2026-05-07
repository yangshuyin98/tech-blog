import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import PostList from './components/PostList.vue'
import GuideList from './components/GuideList.vue'
import GuidesList from './components/GuidesList.vue'
import SpringbootList from './components/SpringbootList.vue'
import JavaList from './components/JavaList.vue'
import DatabaseList from './components/DatabaseList.vue'
import DevopsList from './components/DevopsList.vue'

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('PostList', PostList)
    app.component('GuideList', GuideList)
    app.component('GuidesList', GuidesList)
    app.component('SpringbootList', SpringbootList)
    app.component('JavaList', JavaList)
    app.component('DatabaseList', DatabaseList)
    app.component('DevopsList', DevopsList)
  },
}

export default theme

<template>
  <div class="RichTextBox">
    <editor v-model="tinymceHtml" :init="init"></editor>
  </div>
</template>

<script>
import Api from '@/http/BMakePaper'

import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver/theme'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
// import "tinymce/plugins/code";
// import "tinymce/plugins/table";
// import "tinymce/plugins/lists";
// import "tinymce/plugins/contextmenu";
import 'tinymce/plugins/wordcount'
// import "tinymce/plugins/colorpicker";
// import "tinymce/plugins/textcolor";
import 'tinymce/plugins/fullscreen'

import 'tinymce/plugins/paste'
export default {
  name: 'tinymce',
  data () {
    return {
      name: 'rich',
      tinymceHtml: '',
      init: {
        language_url: 'tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: 'tinymce/skins/ui/oxide',
        plugins:
          'link paste image wordcount fullscreen',
        toolbar:
          'bold italic underline strikethrough | fontsizeselect | fullscreen alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image | removeformat',
        branding: false,
        paste_data_images: true,
        image_advtab: true,
        images_upload_handler: function (blobInfo, success, failure) {
          const formData = new FormData()
          formData.append('file', blobInfo.blob())
          Api.UploadImg(formData).then(res => {
            success(res.data.location)
          })
        }
      }
    }
  },
  props: {
    value: {
      type: String
    }
  },
  created () {
    this.tinymceHtml = this.value
  },
  watch: {
    value (newVal) {
      this.tinymceHtml = newVal
    },
    tinymceHtml (newVal) {
      this.$emit('input', newVal)
    }
  },
  components: { Editor }
}
</script>

<style lang="less" scoped>
</style>

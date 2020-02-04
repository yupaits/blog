<template>
  <layout class="layout-bg">
    <div slot="page-top" class="theme-default-content">
      <div v-if="$profile.mottos.length > 0">
        <h3>格言</h3>
        <div v-for="motto in $profile.mottos" :key="motto" class="motto">{{motto}}</div>
      </div>
      <div>
        <h3>个人简介</h3>
        <div v-if="$profile.personalInfo.nickname" class="items-container">
          <div>昵称：</div>
          <div>{{$profile.personalInfo.nickname}}</div>
        </div>
        <div v-if="$profile.personalInfo.location" class="items-container">
          <div>所在地：</div>
          <div>{{$profile.personalInfo.location}}</div>
        </div>
        <div v-if="$profile.personalInfo.org" class="items-container">
          <div>组织：</div>
          <div>{{$profile.personalInfo.org}}</div>
        </div>
        <div v-if="$profile.personalInfo.email" class="items-container">
          <div>邮箱：</div>
          <div>
            <a :href="`mailto:${$profile.personalInfo.email}`">{{$profile.personalInfo.email}}</a>
          </div>
        </div>
        <div v-for="sns in $profile.personalInfo.sns" v-if="sns.account" class="items-container">
          <div>{{sns.label}}：</div>
          <div>
            <a :href="sns.link" target="_blank">{{sns.account}}</a>
          </div>
        </div>
      </div>
      <div>
        <h3>技能</h3>
        <div v-for="skill in $profile.skills" :key="skill.name" class="items-container">
          <div>{{skill.name}}</div>
          <div>
            <span v-for="i in skill.level">⭐</span><span v-for="i in (10 - skill.level)">⚪</span>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
export default {
  name: 'ProfileLayout'
}
</script>

<style scoped>
.motto {
  padding: 0 8px;
  margin: 1rem 0;
  border-left: 4px #faad14 solid;
  font-size: 16px;
  font-weight: 500;
}
.items-container {
  display: grid;
  grid-template-columns: 1fr 3fr;
}
</style>
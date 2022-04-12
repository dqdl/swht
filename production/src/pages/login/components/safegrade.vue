
<template>
    <div class="safe_grade">
        <div>安全级别</div>
        <div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
</template>

<script lang="ts" setup>

</script>

<style lang="postcss" scoped>
.safe_grade {
    position: absolute;
    bottom: -34px;
    right: 0;
    color: #77d1ff;
    font-size: 16px;
    display: flex;
    align-items: center;
    > div:nth-child(1) {
        margin-right: 10px;
    }
    > div:nth-child(2) {
        display: flex;
        div {
            margin-right: 8px;
            width: 36px;
            height: 10px;
            text-align: center;
            transform: skewX(-45deg);
            border: 1px solid #77d1ff;
            background: #77d1ff;
        }
    }
}
</style>
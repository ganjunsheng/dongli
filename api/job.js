import request from '@/utils/request'

// 获取招工/求职列表
export function getJobList(params) {
  return request({
    url: '/api/job/list',
    method: 'GET',
    data: params
  })
}

// 获取招工/求职详情
export function getJobDetail(id) {
  return request({
    url: `/api/job/detail/${id}`,
    method: 'GET'
  })
}

// 发布招工
export function publishHire(data) {
  return request({
    url: '/api/job/hire/publish',
    method: 'POST',
    data
  })
}

// 发布求职
export function publishSeek(data) {
  return request({
    url: '/api/job/seek/publish',
    method: 'POST',
    data
  })
}

// 更新招工/求职信息
export function updateJob(id, data) {
  return request({
    url: `/api/job/update/${id}`,
    method: 'PUT',
    data
  })
}

// 删除招工/求职信息
export function deleteJob(id) {
  return request({
    url: `/api/job/delete/${id}`,
    method: 'DELETE'
  })
}

// 获取我的发布
export function getMyPublish(params) {
  return request({
    url: '/api/job/my',
    method: 'GET',
    data: params
  })
}

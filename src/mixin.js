import Vue from 'vue'
import firebase from 'firebase'

export default Vue.mixin({
    methods: {
        getRoleName(role) {
            switch (role) {
                case 1:
                    return 'Người dùng'
                case 3:
                    return 'Đại lý'
                case 5:
                    return 'Chủ nhà'
                case 10:
                    return 'Quản trị viên'
            }
        },
        getContractStatus(status) {
          switch(status) {
            case 'closed':
              return {statusName: 'Đã hết hạn', color: 'red'}
            case 'inprogress':
              return {statusName: 'Đang cho thuê', color: 'green'}
            case 'incomming':
              return {statusName: 'Sắp thuê', color: 'amber darken-2'}
          }
        },
        formatListContracts(contracts) {
          contracts.forEach(contract => {
            contract['statusName'] = this.getContractStatus(contract.status).statusName
            contract['color'] = this.getContractStatus(contract.status).color
          })
          return contracts
        },
        formatListItem(list) {
          list.forEach(item => {
            let commingContract = item.contracts.find(contract => {
              return contract.status === 'inprogress'
            })
            if (commingContract) {
              item['bookingDate'] = `${this.convertDate(commingContract.startDate)} ~ ${this.convertDate(commingContract.endDate)}`
              item['statusName'] = 'Đang cho thuê'
            } else {
              let commingContracts = item.contracts.filter(contract => {
                return contract.status === 'incomming'
              })
              if (commingContracts.length === 0) {
                item['bookingDate'] = ""
                item['statusName'] = 'Đang trống'
              } else {
                let minContract = commingContracts.sort((startDate1, startDate2) => {
                  return new Date(startDate2.date) - new Date(startDate1.date);
                })[0]
                item['bookingDate'] = `${this.convertDate(minContract.startDate)} ~ ${this.convertDate(minContract.endDate)}`
                item['statusName'] = 'Sắp cho thuê'
              }
    
            }
          })
          return list
        },
        formatListUser(users) {
          users.forEach(user => {
            user['roleName'] = this.getRoleName(user.role)
          })
          
          return users
        },
        async uploadImageByDataURL(image, imageName, directory) {
            const uploadTask = firebase
              .storage()
              .ref(`images/${directory}/${imageName}`)
            const link = await uploadTask
              .putString(image, 'data_url')
              .then(async () => {
                const imageLink = await firebase
                  .storage()
                  .ref(`images/${directory}`)
                  .child(`${imageName}`)
                  .getDownloadURL()
                  .then(url => {
                    return url
                  })
                return imageLink
              })
            return link
          },
        async uploadImageByFile(image, imageName, directory) {
            const uploadTask = firebase
              .storage()
              .ref(`images/${directory}/${imageName}`)
            const link = await uploadTask
              .put(image)
              .then(async () => {
                const imageLink = await firebase
                  .storage()
                  .ref(`images/${directory}`)
                  .child(`${imageName}`)
                  .getDownloadURL()
                  .then(url => {
                    return url
                  })
                return imageLink
              })
            return link
          },
          convertDate(date) {
            const result = new Date(date)
            return `${result.getDate() < 10 ? '0' + result.getDate() : result.getDate()}-${result.getMonth() < 9 ? '0' + parseInt(result.getMonth() + 1) : result.getMonth() + 1}-${result.getFullYear()}`
          },
          convertDateForPicker(date) {
            const result = new Date(date)
            return `${result.getFullYear()}-${result.getMonth() < 9 ? '0' + parseInt(result.getMonth() + 1) : result.getMonth() + 1}-${result.getDate() < 10 ? '0' + result.getDate() : result.getDate()}`
          },
          convertTime(date) {
            const result = new Date(date)
            return `${result.getHours()}:${result.getMinutes() < 9 ? '0' + result.getMinutes() : result.getMinutes()}`
          }
        }
    
})
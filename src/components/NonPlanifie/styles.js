import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
          container: {
                    padding: 15,
                    backgroundColor: '#fff',
                    height: '100%',
          },
          selectContainer: {
                    borderWidth: 1,
                    borderColor: '#F2F5FE',
                    backgroundColor: '#F2F5FE',
                    elevation: 0,
                    marginTop: 5
          },
          label: {
                    fontSize: 16,
                    fontWeight: 'bold'
          },
          dropdownBox: {
                    borderWidth: 1,
                    marginTop: 10,
                    borderColor: '#ddd',
                    // borderRadius: 15,
                    borderTopLeftRadius: 15,
                    backgroundColor: '#F2F5FE',
                    borderTopRightRadius: 15,
          },
          datePickerButton: {
                    padding: 5,
                    borderWidth: 1,
                    borderColor: '#f1f1f1',
                    marginTop: 10,
                    borderRadius: 5,
                    paddingVertical: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
          },
          iconDebutName: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignContent: 'center'
          },
          icon: {
                    marginLeft: 2
          },
          debutName: {
                    color: '#000',
                    fontSize: 16,
                    marginLeft: 5,
                    opacity: 0.4
          },
          rightDate: {
                    backgroundColor: '#F2F5FE',
                    borderRadius: 10,
                    padding: 5,
          },
          rightDateText: {
                    opacity: 0.5
          },
          actions: {
                    paddingBottom: 30
          },
          openModalize: {
                    backgroundColor: '#dde1ed',
                    padding: 10,
                    borderRadius: 5,
                    marginTop: 5,
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'space-between'
          },
          openModalizeLabel: {
                    color: '#555',
                    fontSize: 14,
          },
          modalContent: {
                    paddingHorizontal: 10,
                    paddingVertical: 15
          },
          modalList: {
                    marginTop: 10,
          },
          modalItem: {
                    paddingVertical: 10,
                    paddingHorizontal: 5,
                    marginTop: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignContent: 'center'
          },
          modalText: {
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginLeft: 10
          },
})

export default styles
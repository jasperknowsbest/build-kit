import React, { Component } from 'react'
import BundleOptions from './BundleOptions'
import BundleView from './BundleView'
import { isEmpty } from 'lodash'
import {products} from './products'

class BuildAKit extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selected: [],
      showCount: true,
      showBuyButton: false,
      products: [],
      loading: true

    }
    this.handleOptionClick = this.handleOptionClick.bind(this)
    this.handleCancelClick = this.handleCancelClick.bind(this)
    this.showCount = this.showCount.bind(this)
    this.getProducts = this.getProducts.bind(this)
    this.updateState = this.updateState.bind(this)
    // this.updateProductCache = this.updateProductCache.bind(this)
  }

  componentWillMount () {
    this.getProducts()
  }



  updateState(products){
    let selected = products
      .filter((product) => product.selected.length > 0)
      .sort((a,b) => a.selected[0] > b.selected[0] )
    this.setState({products: products, loading: false, selected})
  }

    addToCart(){
      let {selected} = this.state
        console.log('added to cart')
        document.getElementById('option_1').value = selected[0].title
        document.getElementById('option_2').value = selected[1].title
        document.getElementById('option_3').value = selected[2].title
        document.getElementById("add").click()
    }



    getProducts () {
    let kitState = localStorage.getItem('kitState') ? JSON.parse(localStorage.getItem('kitState')): null
    //     selected
    if(kitState){
      this.setState({products: kitState, loading: false})
      localStorage.setItem('kitState', JSON.stringify(kitState))
      // this.updateState(kitState);
    } else {
        this.setState({products: products, loading: false})
    }
  }

  renderOptionText () {
    let {selected} = this.state
    if (selected.length == 0) {
      return 'Choose Your First Shade'
    } else if (selected.length == 1) {
      return 'Choose Your Second Shade'
    } else if (selected.length == 2) {
      return 'Choose Your Third Shade'
    } else {
      return 'Congrats! You\'ve made a beautiful kit'
    }
  }

  handleCancelClick (item) {
    let {selected} = this.state
    let index = selected.indexOf(item)
    if (selected.length === 1) {
      selected = []
    } else if (index > -1) {
      selected.splice(index, 1)
    }

    this.setState({selected})
  }

  getAllIndexes (arr, val) {
    var indexes = [], i = -1
    while ((i = arr.indexOf(val, i + 1)) != -1) {
      indexes.push(i)
    }
    return indexes
  }

  showCount (item) {
    let {selected} = this.state
    let count = []
    if (isEmpty(selected)) {
      count = [1]
    }
    else {
      let indexes = this.getAllIndexes(selected, item)
      if (indexes.length === 1) {
        count.push(selected.indexOf(item) + 1)
      } else {
        indexes.map((index) => {
          count.push(index + 1)
        })
      }
    }
    return count
  }
  updateProductCache(item){
    // let products = this.state.products
    let products = JSON.parse(localStorage.getItem('kitState'))
      products.map((product,i) => {
      if (product.id === item.id) products[i] = item
    })
    localStorage.setItem('kitState', JSON.stringify(products))
    return products

  }

  handleOptionClick (item) {
    let {selected} = this.state
    selected.push(item)
    this.setState({
      selected
    })

    // let products = JSON.parse(localStorage.getItem('kitState'))
    // console.log('products', products)
    // let {selected} = this.state
    // item.selected.push(selected.length + 1)
    // selected.push(item)
    // let updatedProducts = this.updateProductCache(item)
    // console.log('updatedProducts handleOption', updatedProducts )
    // console.log('selected', selected)

    // localStorage.setItem('kitState', JSON.stringify(products))
    // localStorage.setItem('selected', JSON.stringify(selected))

  }

  render () {
    let {selected} = this.state
    return (
      <div className='build-a-kit'>
        <BundleView client={this.props.client}
                    addToCart={() => this.addToCart()}
          numSelected={selected.length}
          showBuyButton={selected.length === 3}/>
        <div className="show-selected-option">
          {selected.map((option, i) => {
            return <p key={i}>{`${i + 1}. ${option.title}`}</p>
          })}
        </div>
        <div className={`buy-button-mobile ${selected.length === 3 ? 'enabled': ''}`}>
          <button onClick={() => this.addToCart()}>Add Your Kit to Cart!</button>
        </div>
        <div className={`product-list ${selected.length === 3 ? 'disabled': ''}`}>
          <div className="showContainer">
            <div className="showList"><p>{this.renderOptionText()}</p></div>
          </div>
          <BundleOptions
            loading={this.state.loading}
            products={this.state.products}
            // cancelOption={this.cancelClick}
            doneKit={selected.length === 3}
            // toggleKitCount={() => this.handleHover()}
            showCount={this.state.showCount}
            count={this.state.selected.length + 1}
            countNumber={this.showCount}
            optionClick={this.handleOptionClick}
            handleCancelClick={this.handleCancelClick}/>
        </div>
      </div>)
  }
}

export default BuildAKit
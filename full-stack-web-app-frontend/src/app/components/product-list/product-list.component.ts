import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  // selector: 'app-product-list',
  // selector: 'router-outlet',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  prviousCategoryId: number = 1;
  searchMode: boolean = false;
  theKeyword: string = "";
  previousKeyword: string = "";

  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  constructor(private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => { this.listProducts(); });
  }

  updatePageSize(newPageSize: string) {
    this.thePageSize = +newPageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProduct();
    }
    else {
      this.handleListProduct();
    }

  }

  handleSearchProduct() {
    // const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    this.theKeyword = this.route.snapshot.paramMap.get('keyword')!;

    if (this.previousKeyword != this.theKeyword) {
      this.thePageNumber = 1;
      this.previousKeyword = this.theKeyword;
    }

    this.productService.searchProductPaginate(this.thePageNumber - 1, this.thePageSize, this.theKeyword)
      .subscribe(this.processResult());
  }

  handleListProduct() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else {
      this.currentCategoryId = 3;
    }

    if (this.prviousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
      this.prviousCategoryId = this.currentCategoryId;
    }

    this.productService.getProductListPaginate(this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId).subscribe(
        this.processResult()
      );
  }

  addToCart(theProduct: Product) {
    const cartItem = new CartItem(theProduct);
    this.cartService.addToCart(cartItem);
    // console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);
  }

  private processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

}

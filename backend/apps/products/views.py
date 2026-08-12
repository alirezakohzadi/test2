from django.db.models import Q, Count
from django_filters.rest_framework import FilterSet, filters
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer
class ProductFilter(FilterSet):
    category_slug=filters.CharFilter(field_name='category__slug'); brand_slug=filters.CharFilter(field_name='brand__slug'); min_price=filters.NumberFilter(field_name='price', lookup_expr='gte'); max_price=filters.NumberFilter(field_name='price', lookup_expr='lte'); in_stock=filters.BooleanFilter(method='filter_stock'); is_discounted=filters.BooleanFilter(method='filter_discounted')
    def filter_stock(self,qs,n,v): return qs.filter(stock__gt=0) if v else qs
    def filter_discounted(self,qs,n,v): return qs.filter(discount_price__isnull=False) if v else qs
    class Meta: model=Product; fields=[]
def qs(): return Product.objects.filter(is_active=True).select_related('brand','category').prefetch_related('images')
class ProductList(generics.ListAPIView):
    serializer_class=ProductSerializer; filterset_class=ProductFilter; search_fields=['name','sku','barcode','brand__name','brand__persian_name']; ordering_fields=['price','rating','created_at','sales_count']; ordering=['-created_at']
    def get_queryset(self):
        q=qs(); order=self.request.query_params.get('ordering')
        if order=='popularity': q=q.order_by('-sales_count','-rating')
        return q
class ProductDetail(generics.RetrieveAPIView): serializer_class=ProductSerializer; lookup_field='slug'; queryset=qs()
@api_view(['GET'])
def related(request, slug):
    p=generics.get_object_or_404(qs(), slug=slug); data=qs().filter(Q(category=p.category)|Q(brand=p.brand)).exclude(id=p.id)[:12]
    return Response(ProductSerializer(data, many=True, context={'request':request}).data)
@api_view(['GET'])
def featured(request): return Response(ProductSerializer(qs().filter(is_featured=True)[:12], many=True, context={'request':request}).data)
@api_view(['GET'])
def new_arrivals(request): return Response(ProductSerializer(qs().order_by('-created_at')[:12], many=True, context={'request':request}).data)
@api_view(['GET'])
def best_sellers(request): return Response(ProductSerializer(qs().order_by('-sales_count','-rating')[:12], many=True, context={'request':request}).data)

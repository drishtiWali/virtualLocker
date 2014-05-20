//given denominations, find ways to get sum
#include<stdio.h>
int f[11][1001];
void sort(int array[],int len);
int main()
{
	int t, denom[11];
	int i,j,k;
	int N,M;
	scanf("%d",&t);
	while(t--)
	{
		scanf("%d",&N);
		for(i=0;i<N;i++)
		{
			scanf("%d",&denom[i]);
		}
		scanf("%d",&M);
		sort(denom,N);
		for(i=0;i<=M;i++)
			f[0][i]=1;
		for(i=0;i<N-1;i++)
		{
			for(j=0;j<=M;j++)
			{
				for(k=0;k<=j/denom[i];k++)
				{
					f[i+1][j+denom[i+1]*k]+=f[i][j];
				}
			}
		}
		
		printf("%d\n",f[N-1][M]);
	}
	return 0;
}			
void sort(int array[],int len)
{
	int i=0,j;
	int t;
	for( i=0;i<len-1;i++)
	{
		for(j=0;j<len-i-1;j++)
		{
			if(array[j]>array[j+1])
			{
				t=array[j];
				array[j]=array[j+1];
				array[j+1]=t;
			}
		}
	}
}
				
